import fs from 'fs';

const getExistingMeds = async () => {
    try {
        const response = await fetch('https://firebasedata.herokuapp.com/api/v1/pharmacyInventoryStorage', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=UTF-8',
            },
        });

        if (response.status !== 200) {
            console.log('There are no available medicines in the database yet! Please add some first.');
            return false;
        }

        const availableMeds = await response.json();
        const meds = availableMeds.data;
        const medsObject = {};
        
        meds.forEach((med, index) => {
            const medName = med.medicineName;
            const id = med.documentId;

            medsObject[index] = { name: medName, id: id };
        });

        return medsObject;
    } catch (error) {
        console.error('Error checking medicines in the database', error.message);
        return {};
    }
}

const updateData = async (id, data) => {
    try {
        const url = `https://firebasedata.herokuapp.com/api/v1/pharmacyInventoryStorage/${id}`;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            console.error('Error updating medicine:', response);
            return { status: 'error' };
        } else {
            console.log('Successfully updated');
            return { status: 'success' };
        }
    } catch (error) {
        console.error('Error updating the medicine:', error.message);
       
    }
}

const postData = async(data) => {
try {
    const url = 'https://firebasedata.herokuapp.com/api/v1/pharmacyInventoryStorage';
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.status !== 200) {
            throw new Error('Failed to add the medicine');
        }

        return{
            message: "Succesfully update the data",
            status: 200
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}

async function updateDatabaseWithMedicines() {
    try {
        const medicinesString = fs.readFileSync('./data.json', 'utf8');
        const medicines = JSON.parse(medicinesString);

        const existingMeds = await getExistingMeds();

        for (const medicine of medicines) {
            const name = medicine.medicineName.toLowerCase();
            let id;

            if (existingMeds) {
                for (const key in existingMeds) {
                    if (existingMeds[key].name.toLowerCase() === name) {
                        id = existingMeds[key].id;
                        break;
                    }
                }
            }

            if (id) {
                console.log('Updating medicine:', medicine.medicineName);
                const response = await updateData(id, medicine);
                if (response.status === 'success') {
                    console.log('Successfully updated data in db', response);
                } else {
                    console.error('Failed to update data in db', response);
                }
            } else {
                console.log('Adding new medicine:', medicine.medicineName);
                const response = await postData(medicine);
                if (response.status === 200) {
                    console.log('Successfully added data to db', response);
                } else {
                    console.error('Failed to add data to db', response);
                }
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
}
updateDatabaseWithMedicines();