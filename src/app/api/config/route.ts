import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import DOMPurify from 'isomorphic-dompurify';
import { Redis } from '@upstash/redis';
import { unstable_cache, revalidatePath } from 'next/cache';

const dataFilePath = path.join(process.cwd(), 'src', 'data', 'config.json');

// Get Redis instance if env vars are present
const getRedis = () => {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    return new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    });
  }
  return null;
};

// Cached fetch function (the "buffer")
const getCachedConfig = unstable_cache(
  async () => {
    let data;
    const redis = getRedis();

    if (redis) {
      // Tenta ler do Redis
      data = await redis.get('editora_config');
      
      // Se o Redis estiver vazio, puxa do arquivo local e migra pro Redis
      if (!data) {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        data = JSON.parse(fileContent);
        await redis.set('editora_config', data);
      }
    } else {
      // Fallback local caso não tenha Redis
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      data = JSON.parse(fileContent);
    }
    
    return data;
  },
  ['editora-config-cache'],
  { tags: ['config'] }
);

export async function GET() {
  try {
    const data: any = await getCachedConfig();
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
    
    // Lê os dados atuais ignorando o cache
    let currentData: any;
    const redis = getRedis();

    if (redis) {
      currentData = await redis.get('editora_config');
      if (!currentData) {
        const fileContent = await fs.readFile(dataFilePath, 'utf-8');
        currentData = JSON.parse(fileContent);
      }
    } else {
      const fileContent = await fs.readFile(dataFilePath, 'utf-8');
      currentData = JSON.parse(fileContent);
    }

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

    // Atualiza
    const newData = { ...currentData, ...body };
    if (!body.password) newData.password = currentData.password;

    // Salva
    if (redis) {
      await redis.set('editora_config', newData);
    } else {
      await fs.writeFile(dataFilePath, JSON.stringify(newData, null, 2), 'utf-8');
    }

    // Limpa o cache (o Buffer é revalidado aqui!)
    revalidatePath('/', 'layout');
    
    const { password, ...safeData } = newData;
    return NextResponse.json({ success: true, data: safeData });
  } catch (error) {
    console.error("Error writing config:", error);
    return NextResponse.json({ error: 'Failed to write data' }, { status: 500 });
  }
}
