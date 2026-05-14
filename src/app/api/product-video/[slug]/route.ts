import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const sweetProducts = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Sweet_Products');
const saltyProducts = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Salty_Products');
const otherPhotos = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'OtherPhotos_For_Website_and_Landing_pages_Examples');

const productVideos: Record<string, string> = {
  'hazelnut-butter': path.join(sweetProducts, 'Hazelnut_butter_vid.mp4'),
  'pistachio-butter': path.join(sweetProducts, 'pistachio_and_hazelnut_butter_vid.mp4'),
  'healthy-nutella': path.join(otherPhotos, 'Healthy_White_Chocolate_Nutella_vid.mp4'),
  'granola': path.join(sweetProducts, 'Granula_vid.mp4'),
  'zrir-hazelnut-almonds': path.join(sweetProducts, 'Zrir_With_Ferrero_rocher_taste_vid.mp4'),
  'zrir-pistachio': path.join(sweetProducts, 'زرير الفزدق.mp4'),
  'harissa': path.join(saltyProducts, 'Harissa_vid.mp4'),
  'chicken-meatballs': path.join(saltyProducts, 'Harissa_And_Meatballs_vid.mp4'),
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const filePath = productVideos[slug];

  if (!filePath) {
    return NextResponse.json({ error: 'Product video not found.' }, { status: 404 });
  }

  const file = await stat(filePath).catch(() => null);
  if (!file) {
    return NextResponse.json({ error: 'Product video file missing.' }, { status: 404 });
  }

  const range = request.headers.get('range');
  const headers = new Headers({
    'Content-Type': 'video/mp4',
    'Accept-Ranges': 'bytes',
    'Cache-Control': 'public, max-age=31536000, immutable',
  });

  if (!range) {
    headers.set('Content-Length', String(file.size));
    const stream = Readable.toWeb(createReadStream(filePath)) as ReadableStream;
    return new NextResponse(stream, { headers });
  }

  const [startRaw, endRaw] = range.replace('bytes=', '').split('-');
  const start = Number(startRaw);
  const end = endRaw ? Number(endRaw) : Math.min(start + 1024 * 1024 - 1, file.size - 1);

  if (Number.isNaN(start) || Number.isNaN(end) || start >= file.size || end >= file.size) {
    return new NextResponse(null, {
      status: 416,
      headers: {
        'Content-Range': `bytes */${file.size}`,
      },
    });
  }

  headers.set('Content-Length', String(end - start + 1));
  headers.set('Content-Range', `bytes ${start}-${end}/${file.size}`);

  const stream = Readable.toWeb(createReadStream(filePath, { start, end })) as ReadableStream;
  return new NextResponse(stream, { status: 206, headers });
}
