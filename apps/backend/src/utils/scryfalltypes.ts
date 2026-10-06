import { z } from 'zod';

export interface ScryfallCard {
  id: string;
  oracle_id: string;
  multiverse_ids: number[];
  name: string;
  printed_name?: string;
  lang: string;
  released_at: string;
  mana_cost?: string;
  cmc?: number;
  type_line?: string;
  oracle_text?: string;
  colors?: string[];
  color_identity?: string[];
  image_uris?: Record<string, string>;
  set_id: string;
  set: string;
  set_name: string;
  rarity?: string;
  artist?: string;
  legalities?: Record<string, string>;
  prices?: Record<string, any>;
  [key: string]: any;
}

export const scryfallBulkDataSchema = z.object({
  object: z.string(),
  id: z.string(),
  type: z.string(),
  updated_at: z.string(),
  uri: z.string(),
  name: z.string(),
  description: z.string(),
  jsonl_download_uri: z.string(),
  compressed_size: z.number(),
});

export type scryfallBulkData = z.infer<typeof scryfallBulkDataSchema>;

export const scryfallBulkEndpointSchema = z.object({
  object: z.string(),
  has_more: z.boolean(),
  data: z.array(scryfallBulkDataSchema),
});

export type scryfallBulkEndpoint = z.infer<typeof scryfallBulkEndpointSchema>;
