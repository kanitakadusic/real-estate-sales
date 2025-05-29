const path = require('path');
const fs = require('fs').promises;

exports.readJsonFile = async (fileName) => {
    const filePath = path.join(__dirname, '../data', `${fileName}.json`);
    try {
        const rawData = await fs.readFile(filePath, 'utf-8');
        return JSON.parse(rawData);
    } catch (error) {
        console.error(`Error reading JSON file ${fileName}.json:`, error);
        throw error;
    }
};

exports.saveJsonFile = async (fileName, data) => {
    const filePath = path.join(__dirname, '../data', `${fileName}.json`);
    try {
        await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    } catch (error) {
        console.error(`Error writing JSON file ${fileName}.json:`, error);
        throw error;
    }
};

exports.addInTxtFile = async (fileName, data) => {
    const filePath = path.join(__dirname, '../logs', `${fileName}.txt`);
    try {
        await fs.appendFile(filePath, data, 'utf-8');
    } catch (error) {
        console.error(`Error appending TXT file ${fileName}.txt:`, error);
        throw error;
    }
};