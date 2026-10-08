import { prisma } from './prisma.js';
import * as fs from 'fs';
import * as zlib from 'zlib';
import * as readline from 'readline';
import { scryfallBulkEndpointSchema } from './scryfalltypes.js';
import type { ScryfallCard } from './scryfalltypes.js';

function transformCard(card: ScryfallCard) {
  return {
    scryfallId: card.id,
    oracleId: card.oracle_id || null,
    name: card.name,
    printedName: card.printed_name || null,
    lang: card.lang,
    releasedAt: card.released_at ? new Date(card.released_at) : null,
    manaCost: card.mana_cost || null,
    cmc: card.cmc || null,
    typeLine: card.type_line || null,
    oracleText: card.oracle_text || null,
    colors: card.colors || [],
    colorIdentity: card.color_identity || [],
    setId: card.set_id,
    setCode: card.set,
    setName: card.set_name,
    rarity: card.rarity || null,
    artist: card.artist || null,
    multiverseIds: card.multiverse_ids || null,
    imageUris: card.image_uris || null,
    legalities: card.legalities || null,
    prices: card.prices || null,
    rawData: card,
  };
}

async function downloadFile(url: string, filePath: string): Promise<void> {
  console.log(`󱑥 downloading bulkdata from: ${url}`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  fs.writeFileSync(filePath, Buffer.from(buffer));
}

async function insertBatch(batch: any[], batchNumber: number) {
  try {
    await prisma.card.createMany({
      data: batch,
      skipDuplicates: true,
    });
    console.log(`  ✓ Batch ${batchNumber}: Inserted ${batch.length} cards`);
  } catch (error) {
    console.warn(`  ⚠ Batch ${batchNumber} failed with createMany, trying individual inserts...`);
    let successCount = 0;
    for (const item of batch) {
      try {
        await prisma.card.upsert({
          where: { scryfallId: item.scryfallId },
          update: { rawData: item.rawData },
          create: item,
        });
        successCount++;
      } catch (e) {
        console.error(`    ✗ Failed to insert ${item.scryfallId}:`, e);
      }
    }
    console.log(`  ✓ Batch ${batchNumber}: Inserted ${successCount}/${batch.length} cards`);
  }
}

async function getDailyBulk(bulkName: string) {
  const bulkDataURL = 'https://api.scryfall.com/bulk-data';
  const response = await fetch(bulkDataURL, {
    headers: { 'User-Agent': 'TCGHub/1.0' },
  });
  if (!response.ok) {
    console.log(await response.json());
    throw new Error('URL fetch error');
  } else {
    const bulkData = scryfallBulkEndpointSchema.parse(await response.json());
    const bulkDataData = bulkData['data'];
    for (const x of bulkDataData) {
      if (x['type'] === bulkName) {
        return x['jsonl_download_uri'];
      }
    }
  }
  throw new Error('bulk name not found');
}

async function loadCards() {
  const bulkCardsURL = await getDailyBulk('all_cards');
  const bulkCardsFile = bulkCardsURL.replace(/(^.*\/)([a-zA-Z0-9-.]+$)/, '$2');
  const batchSize = 1000;
  let batch: any[] = [];
  let lineCount = 0;
  let insertedCount = 0;
  let batchNumber = 0;

  await downloadFile(bulkCardsURL, bulkCardsFile);
  const fileStream = fs.createReadStream(bulkCardsFile);
  const gunzip = zlib.createGunzip();

  const rl = readline.createInterface({
    input: fileStream.pipe(gunzip),
    crlfDelay: Infinity,
  });

  console.log('󰥝 Starting card import...');
  const startTime = Date.now();

  for await (const line of rl) {
    if (!line.trim()) continue;

    try {
      const card: ScryfallCard = JSON.parse(line);
      const transformed = transformCard(card);
      batch.push(transformed);

      lineCount++;

      if (batch.length >= batchSize) {
        batchNumber++;
        await insertBatch(batch, batchNumber);
        insertedCount += batch.length;
        batch = [];

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`📈 Progress: ${insertedCount.toLocaleString()} in ${elapsed}s`);
      }
    } catch (error) {
      console.error(`❌ Error parsing line ${lineCount}:`, error);
    }
  }

  if (batch.length > 0) {
    batchNumber++;
    await insertBatch(batch, batchNumber);
    insertedCount += batch.length;
  }

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  const elapsedMinutes = (Number(elapsed) / 60).toFixed(1);
  console.log(
    `\n✅ Import complete!\n   Inserted: ${insertedCount.toLocaleString()} cards\n   Time: ${elapsed}s (${elapsedMinutes} minutes)\n   Rate: ${(insertedCount / Number(elapsed)).toFixed(0)} cards/second`,
  );

  await prisma.$disconnect();
  fs.rm(bulkCardsFile, () => {});
}

loadCards().catch((error) => {
  console.error('󰀦 Fatal error:', error);
  process.exit(1);
});
