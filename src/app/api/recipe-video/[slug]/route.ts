import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const sweetRecipes = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Sweet_Products', 'Recepies');
const saltyRecipes = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Salty_Products', 'Recepies');

const recipeVideos: Record<string, string> = {
  'japanese-cake-bennet-kamar': path.join(sweetRecipes, 'Japanese_Cake_Bannit_Kmar_Edition_recipie_vid.mp4'),
  'mini-pancakes-pistachio': path.join(sweetRecipes, 'MiniPancakes_with_pistachio_butter_as_toppings_vid.mp4'),
  'pistachio-iced-coffee': path.join(sweetRecipes, 'Pistachio_Iced_Coffee_recepie_Using_Pistachio_Butter_vid.mp4'),
  'mini-donuts-hazelnut': path.join(sweetRecipes, 'Mini_Doghnut_with_Hazelnut_butter_filling_vid.mp4'),
  'no-flour-natural-nutella-cake': path.join(sweetRecipes, 'Cake_recepie_No_Flour_With_Natural_Nutella_vid.mp4'),
  'crepes-strawberry-jam': path.join(sweetRecipes, 'Crepes_with_strawberry_Jam_vid.mp4'),
  'panna-cotta-apricot': path.join(sweetRecipes, 'Panna cotta_with_Abricot_Jam_vid.mp4'),
  'pesto-bennet-kamar': path.join(saltyRecipes, 'Pesto_Binnet_Kmar_Edition_recepie_video.mp4'),
  'date-bites-hazelnut': path.join(sweetRecipes, 'Date_Bites_With_Hazelnut_butter_vid.mp4'),
  'healthy-dessert-strawberry-jam': path.join(sweetRecipes, 'Healthy_Desert_Recepie_with_Strawberry_Jam_vid.mp4'),
  'cookies-cashew-butter': path.join(sweetRecipes, 'Cookies_recepie_with_Cashews_Butter_vid.mp4'),
  'gelatto-hazelnut-pistachio': path.join(sweetRecipes, 'Gelatto_recepie_with_Both_Hazelnut_and_Pistachio_Butter.mp4'),
  'jwajem-safxiya': path.join(sweetRecipes, "'Jwajem Safxiya Bennet Kmar Edition ' _recepie_vid.mp4"),
  'brownies-hazelnut-butter': path.join(sweetRecipes, 'Brownies_with_Hazelnut_butter_recepie_vid.mp4'),
  'lava-cake-hazelnut': path.join(sweetRecipes, 'Lava_Cake_with_Hazelnut_butter_recepie_vid.mp4'),
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const filePath = recipeVideos[slug];

  if (!filePath) {
    return NextResponse.json({ error: 'Recipe video not found.' }, { status: 404 });
  }

  const file = await stat(filePath).catch(() => null);
  if (!file) {
    return NextResponse.json({ error: 'Recipe video file missing.' }, { status: 404 });
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
