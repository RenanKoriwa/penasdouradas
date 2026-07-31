import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ler os dados atuais para verificar a senha
    const fileContent = await fs.readFile(dataFilePath, 'utf-8');
    const data = JSON.parse(fileContent);

    if (body.password && body.password === data.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking password:", error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
