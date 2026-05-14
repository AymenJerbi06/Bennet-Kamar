import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { getAdminFromRequest } from '@/lib/adminAuth';

export const runtime = 'nodejs';

const IMAGE_TYPES = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/webp', '.webp'],
  ['image/gif', '.gif'],
]);

const VIDEO_TYPES = new Map([
  ['video/mp4', '.mp4'],
  ['video/webm', '.webm'],
  ['video/quicktime', '.mov'],
]);

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
}

export async function POST(request: NextRequest) {
  if (!getAdminFromRequest(request)) return unauthorized();

  const formData = await request.formData();
  const file = formData.get('file');

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'A media file is required.' }, { status: 400 });
  }

  const extension = IMAGE_TYPES.get(file.type) || VIDEO_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: 'Only JPG, PNG, WEBP, GIF, MP4, WEBM, or MOV files are supported.' }, { status: 400 });
  }

  const isVideo = VIDEO_TYPES.has(file.type);
  const maxSize = isVideo ? 80 * 1024 * 1024 : 8 * 1024 * 1024;
  if (file.size > maxSize) {
    return NextResponse.json({
      error: isVideo ? 'Videos must be 80 MB or smaller.' : 'Images must be 8 MB or smaller.',
    }, { status: 400 });
  }

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  await mkdir(uploadsDir, { recursive: true });

  const fileName = `${Date.now()}-${randomUUID()}${extension}`;
  const bytes = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadsDir, fileName), bytes);

  return NextResponse.json({
    url: `/uploads/${fileName}`,
  });
}
