import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';
import { revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxGRw_5cy9DXQ1T07brIMVtywRLolIzvyNmtOfPkDRGjdAgkY0bXBZXuTAGYoT00UZ1/exec';

// Fetch from Sheets with a fallback to local config.json
async function fetchConfig() {
  let localData = {};
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    localData = JSON.parse(fileContent);
  } catch (e) {
    console.error("Local config not found.");
  }

  try {
    // We add a timestamp to bypass aggressive GET caching at the fetch level if needed,
    // but Next.js will cache it based on revalidatePath.
    const res = await fetch(SHEET_URL, { next: { tags: ['config'], revalidate: 3600 } });
    if (res.ok) {
      const sheetData = await res.json();
      // If the sheet is completely empty or error, fallback to local
      if (sheetData && !sheetData.error && Object.keys(sheetData).length > 0) {
        return { ...localData, ...sheetData }; // Merge to ensure we have structure
      }
    }
  } catch (e) {
    console.error("Failed to fetch from Google Sheets:", e);
  }
  
  return localData;
}

export async function GET() {
  try {
    const data: any = await fetchConfig();
    const { password, ...safeData } = data || {};
    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Error reading config:", error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    // Get current data to validate password
    const currentData: any = await fetchConfig();

    // Validar autenticação
    if (!authHeader || authHeader !== currentData?.password) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Sanitizar
    if (body.about) body.about = DOMPurify.sanitize(body.about);
    if (body.services && Array.isArray(body.services)) {
      body.services = body.services.map((s: any) => ({
        ...s,
        content: s.content ? DOMPurify.sanitize(s.content) : ""
      }));
    }

    // Atualiza os dados
    const newData = { ...currentData, ...body };
    if (!body.password) newData.password = currentData.password;

    // Tenta salvar localmente (útil em dev, inútil em produção na Vercel)
    try {
      await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    } catch(e) {}

    // Salva no Google Sheets (Backend oficial)
    try {
      await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(newData),
        // no-cors mode prevents CORS errors if the Apps Script isn't returning correct headers,
        // but we want to read the response. The Apps Script we provided handles this if deployed correctly.
      });
    } catch (e) {
      console.error("Failed to post to Google Sheets:", e);
    }

    // Limpa o cache para todos verem as atualizações instantaneamente
    revalidatePath('/', 'layout');
    
    const { password, ...safeData } = newData;
    return NextResponse.json({ success: true, data: safeData });
  } catch (error) {
    console.error("Error writing config:", error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
