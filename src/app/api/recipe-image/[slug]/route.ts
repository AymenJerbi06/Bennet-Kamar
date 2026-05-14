import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { Readable } from 'node:stream';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const sweetRecipes = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Sweet_Products', 'Recepies');
const saltyRecipes = path.join(/* turbopackIgnore: true */ process.cwd(), 'Products', 'products', 'Salty_Products', 'Recepies');

const recipeImages: Record<string, { file: string; type: string }> = {
  'japanese-cake-bennet-kamar': { file: path.join(sweetRecipes, 'Japanese_Cake_Bannit_Kmar_Edition_recipie_img1.jpg'), type: 'image/jpeg' },
  'japanese-cake-bennet-kamar-2': { file: path.join(sweetRecipes, 'Japanese_Cake_Bannit_Kmar_Edition_recipie_img2.jpg'), type: 'image/jpeg' },
  'pistachio-iced-coffee-2': { file: path.join(sweetRecipes, 'Pistachio_Iced_Coffee_recepie_Using_Pistachio_Butter_img2.jpg'), type: 'image/jpeg' },
  'crepes-strawberry-jam': { file: path.join(sweetRecipes, 'Crepes_with_strawberry_Jam_img.png'), type: 'image/png' },
  'panna-cotta-apricot': { file: path.join(sweetRecipes, 'Panna cotta_with_Abricot_Jam_img.png'), type: 'image/png' },
  'pesto-bennet-kamar': { file: path.join(saltyRecipes, 'Pesto_Binnet_Kmar_Edition_recepie_img.png'), type: 'image/png' },
  'date-bites-hazelnut': { file: path.join(sweetRecipes, 'Date_Bites_With_Hazelnut_butter_img.png'), type: 'image/png' },
  'healthy-dessert-strawberry-jam': { file: path.join(sweetRecipes, 'Healthy_Desert_Recepie_with_Strawberry_Jam_img.png'), type: 'image/png' },
  'cookies-cashew-butter': { file: path.join(sweetRecipes, 'Cookies_recepie_with_Cashews_Butter_img.png'), type: 'image/png' },
  'gelatto-hazelnut-pistachio': { file: path.join(sweetRecipes, 'Gelatto_recepie_with_Both_Hazelnut_and_Pistachio_Butter_img.png'), type: 'image/png' },
  'jwajem-safxiya': { file: path.join(sweetRecipes, "'Jwajem Safxiya Bennet Kmar Edition ' _recepie_img.png"), type: 'image/png' },
  'brownies-hazelnut-butter': { file: path.join(sweetRecipes, 'Brownies_with_Hazelnut_butter_recepie_img.png'), type: 'image/png' },
  'lava-cake-hazelnut': { file: path.join(sweetRecipes, 'Lava_Cake_with_Hazelnut_butter_recepie_img.png'), type: 'image/png' },
  'no-flour-natural-nutella-cake': { file: path.join(sweetRecipes, 'Cake_recepie_No_Flour_With_Natural_Nutella.jpg'), type: 'image/jpeg' },
};

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  const { slug } = await context.params;
  const media = recipeImages[slug];

  if (!media) {
    return NextResponse.json({ error: 'Recipe image not found.' }, { status: 404 });
  }

  const file = await stat(media.file).catch(() => null);
  if (!file) {
    return NextResponse.json({ error: 'Recipe image file missing.' }, { status: 404 });
  }

  const stream = Readable.toWeb(createReadStream(media.file)) as ReadableStream;
  return new NextResponse(stream, {
    headers: {
      'Content-Type': media.type,
      'Content-Length': String(file.size),
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}
