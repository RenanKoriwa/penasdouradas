import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);
    // Remove password before sending to client
    const { password, ...safeData } = data;
    return NextResponse.json(safeData);
  } catch (error) {
    console.error("Error reading config.json:", error);
    return NextResponse.json({ error: 'Failed to read data' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const body = await request.json();
    
    // Ler os dados atuais
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    // Validar autenticação
    if (!authHeader || authHeader !== data.password) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 });
    }

    // Sanitizar XSS antes de salvar
    if (body.about) {
      body.about = DOMPurify.sanitize(body.about);
    }
    if (body.services && Array.isArray(body.services)) {
      body.services = body.services.map((s: any) => ({
        ...s,
        content: s.content ? DOMPurify.sanitize(s.content) : ""
      }));
    }

    // Atualizar os dados
    const newData = { ...data, ...body };
    if (!body.password) {
      newData.password = data.password;
    }

    // Salvar no arquivo
    await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    
    // Remove password from response
    const { password, ...safeData } = newData;
    return NextResponse.json({ success: true, data: safeData });
  } catch (error) {
    console.error("Error writing config.json:", error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
