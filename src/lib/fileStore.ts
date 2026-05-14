import 'server-only';

import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const dataDir = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  await mkdir(dataDir, { recursive: true });
}

export async function readJson<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);

  try {
    const raw = await readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function writeJson<T>(filename: string, value: T) {
  await ensureDataDir();
  const filePath = path.join(dataDir, filename);
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, 'utf8');
}
