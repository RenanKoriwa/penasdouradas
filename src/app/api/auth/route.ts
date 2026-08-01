import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { fetchConfig } from '../config/route';

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Ler os dados atuais do banco de dados (Google Sheets ou local fallback)
    const data: any = await fetchConfig();

    if (body.password && hashPassword(body.password) === data.password) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: false, error: 'Senha incorreta' }, { status: 401 });
    }
  } catch (error) {
    console.error("Error checking password:", error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
