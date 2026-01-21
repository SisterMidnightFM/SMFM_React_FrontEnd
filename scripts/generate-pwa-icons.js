import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_IMAGE = join(__dirname, '../public/SmfmLogo.png');
const OUTPUT_DIR = join(__dirname, '../public');

const icons = [
  { name: 'pwa-192x192.png', size: 192 },
  { name: 'pwa-512x512.png', size: 512 },
  { name: 'apple-touch-icon-180x180.png', size: 180 },
];

async function generateIcons() {
  console.log('Generating PWA icons from:', SOURCE_IMAGE);

  for (const icon of icons) {
    const outputPath = join(OUTPUT_DIR, icon.name);

    await sharp(SOURCE_IMAGE)
      .resize(icon.size, icon.size)
      .png()
      .toFile(outputPath);

    console.log(`✓ Generated ${icon.name} (${icon.size}x${icon.size})`);
  }

  console.log('\nAll PWA icons generated successfully!');
}

generateIcons().catch(console.error);
