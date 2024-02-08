import fs from 'fs';
import medicines from './data3.js'

function getRandomManufacturer() {
    const manufacturers = [
        "Pfizer Inc. (USA)",
        "Novartis International AG (Switzerland)",
        "Roche Holding AG (Switzerland)",
        "Johnson & Johnson (USA)",
        "Merck & Co., Inc. (USA)",
        "Sanofi (France)",
        "GlaxoSmithKline plc (UK)",
        "AstraZeneca plc (UK/Sweden)",
        "Bayer AG (Germany)",
        "Eli Lilly and Company (USA)"
    ];
    return manufacturers[Math.floor(Math.random() * manufacturers.length)];
}

function getRandomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function getRandomUnit() {
    const units = ["milligrams", "grams", "microgram", "milliliters"];
    return units[Math.floor(Math.random() * units.length)];
}


const today = new Date();

medicines.forEach(item => {
    item.unit = getRandomUnit();
    item.manufacturer = getRandomManufacturer();
    item.batchNumber = "B-" + Math.floor(Math.random() * 10000);
    item.quantity = Math.min(40, Math.floor(Math.random() * 41));
    item["date-received"] = today;
    item["date-manufactured"] = getRandomDate(new Date(2020, 0, 1), today);
    item["date-expires"] = getRandomDate(today, new Date(today.getTime() + 365 * 24 * 60 * 60 * 1000 * 3));
});

const updatedData = 'export default ' + JSON.stringify(medicines, null, 2) + ';';
fs.writeFileSync('./data3.js', updatedData, 'utf8');

console.log("Data updated and saved successfully.");
