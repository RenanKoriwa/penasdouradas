import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxGRw_5cy9DXQ1T07brIMVtywRLolIzvyNmtOfPkDRGjdAgkY0bXBZXuTAGYoT00UZ1/exec?v=3';

export async function fetchConfig() {
  let localData = {};
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localData = JSON.parse(fileContent);
  } catch (e) {
    console.error("Local config not found.");
  }

  try {
    const res = await fetch(SHEET_URL, { next: { tags: ['config'], revalidate: 3600 } });
    if (res.ok) {
      const sheetData = await res.json();
      if (sheetData && !sheetData.error && Object.keys(sheetData).length > 0) {
        return { ...localData, ...sheetData };
      }
    }
  } catch (e) {
    console.error("Failed to fetch from Google Sheets:", e);
  }
  
  return localData;
}
