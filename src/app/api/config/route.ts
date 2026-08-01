import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';
import { revalidatePath } from 'next/cache';
import { fetchConfig } from '@/lib/config';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');
const SHEET_URL = 'https://script.google.com/macros/s/AKfycbxGRw_5cy9DXQ1T07brIMVtywRLolIzvyNmtOfPkDRGjdAgkY0bXBZXuTAGYoT00UZ1/exec?v=3';

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
    
    const currentData: any = await fetchConfig();

    if (!authHeader || authHeader !== currentData?.password) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    if (body.about) body.about = DOMPurify.sanitize(body.about);
    if (body.services && Array.isArray(body.services)) {
      body.services = body.services.map((s: any) => ({
        ...s,
        content: s.content ? DOMPurify.sanitize(s.content) : ""
      }));
    }

    const newData = { ...currentData, ...body };
    if (!body.password) newData.password = currentData.password;

    try {
      await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    } catch(e) {}

    try {
      await fetch(SHEET_URL, {
        method: "POST",
        body: JSON.stringify(newData),
      });
    } catch (e) {
      console.error("Failed to post to Google Sheets:", e);
    }

    revalidatePath('/', 'layout');
    
    const { password, ...safeData } = newData;
    return NextResponse.json({ success: true, data: safeData });
  } catch (error) {
    console.error("Error writing config:", error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
