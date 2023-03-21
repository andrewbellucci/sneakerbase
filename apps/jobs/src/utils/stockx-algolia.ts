import Algolia from 'algoliasearch';
import { env } from "./env";

const client = Algolia(
  env.STOCKX_ALGOLIA_APP_ID,
  env.STOCKX_ALGOLIA_API_KEY,
);

export const defaultStockXAlgoliaOptions = {
  page: 0,
  hitsPerPage: 50,
  typoTolerance: true,
  filters: 'product_category: "sneakers"',
};

export const stockXAlgolia = client.initIndex('products');

export async function searchStockX(
  query: string,
  options: SearchOptions = defaultStockXAlgoliaOptions,
) {
  return stockXAlgolia.search<SneakerResponse>(query, options);
}

export interface SearchOptions {
  page?: number;
  hitsPerPage?: number;
  typoTolerance?: boolean;
  filters?: string;
}

interface SneakerTrait {
  name: string;
  value: string | number | boolean;
  filterable: boolean;
  visible: boolean;
  highlight: boolean;
}

interface SneakerMedia {
  imageUrl: string;
  smallImageUrl: string;
  thumbUrl: string;
  gallery: string[];
  hidden: boolean;
}

export interface SneakerResponse {
  id: string;
  uuid: string;
  name: string;
  brand: string;
  thumbnail_url: string;
  media: SneakerMedia;
  url: string;
  release_date: string;
  categories: string[];
  product_category: string;
  ticker_symbol: string;
  style_id: string;
  make: string;
  model: string;
  short_description: string;
  gender: string;
  colorway: string;
  price: number;
  description: string;
  highest_bid: number;
  total_dollars: number;
  lowest_ask: number;
  last_sale: number;
  sales_last_72: number;
  deadstock_sold: number;
  quality_bid: number;
  active: number;
  new_release: number;
  featured: number;
  lock_selling: boolean;
  Traits: SneakerTrait[];
  searchable_traits: Record<string, string>;
  objectID: string;
}
