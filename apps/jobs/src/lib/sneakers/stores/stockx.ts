import { generateProxyString } from "../../../utils/generate-proxy";
import { prisma } from "../../../utils/prisma";
import { Store } from "@sneakerbase/database";
import { searchStockX } from "../../../utils/stockx-algolia";
import { Price } from "../types";
import { Sentry } from "../../../utils/sentry";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudscraper = require("cloudscraper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require("promise-retry");

export interface StockxProductData {
  styleId: string;
  name: string;
  image: string;
  brand: string;
  colorway: string;
  make: string;
  retailPrice: number;
  releaseDate: string;
  link: string;
}

export async function processPricing(productId: string): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sku: true, stockXUrl: true },
    });

    if (!product) throw Error(`Product with id "${productId}" does not exist.`);

    const { prices, url } = await getPricesAndUrl(product.sku);

    if (product.stockXUrl !== url) {
      await prisma.product.update({
        where: { id: productId },
        data: { stockXUrl: url }
      });
    }

    const pricesStored = await prisma.price.findMany({
      where: {
        productId,
        store: Store.STOCKX,
      },
      select: { id: true, store: true, size: true, price: true },
      orderBy: { createdAt: 'desc' },
      distinct: ['store', 'size']
    });

    await Promise.all(prices.map(async price => {
      const priceStored = pricesStored.find(priceStored => priceStored.size === price.size);
      if (!priceStored) {
        await prisma.price.create({
          data: {
            productId,
            store: Store.STOCKX,
            size: price.size,
            price: price.price,
          }
        });
      } else {
        await prisma.price.update({
          where: { id: priceStored.id },
          data: {
            price: price.price,
            change: price.price - priceStored.price,
          }
        });
      }
    }));
  } catch (error) {
    Sentry.captureException(error);
  }
}

async function getPricesAndUrl(sku: string): Promise<{ prices: Price[], url: string }> {
  const productData = await getProductData(sku);
  const pricing = await getProductPricing(productData.link);

  return {
    prices: Object.keys(pricing).map(size => ({
      size,
      price: pricing[size],
    })),
    url: productData.link
  }
}

async function getProductData(sku: string): Promise<StockxProductData> {
  const response = await searchStockX(sku);

  if (response.hits.length === 0) throw Error(`"${sku}" does not exist.`);

const hit = response.hits[0];

return {
  styleId: hit.style_id,
  name: hit.name,
  image: hit.media.imageUrl,
  brand: hit.brand,
  colorway: hit.colorway,
  make: hit.make,
  retailPrice: Number(hit.searchable_traits['Retail Price']),
  releaseDate: hit.release_date,
  // Save this or metadata related to scraping in the database to save bandwidth
  link: 'https://stockx.com/' + hit.url,
};
}

async function getProductPricing(link: string): Promise<Record<string, number>> {
  let response = await promiseRetry(
    (retry: any) => cloudscraper.get(
      'https://stockx.com/api/products/' + link.split('.com/')[1] + '?includes=market&excludes=media',
      { proxy: generateProxyString('http') }
    ).catch(retry)
  );

  const parsedBody = JSON.parse(response);
  const children = parsedBody.Product.children;
  const pricing: Record<string, number> = {};

  Object.keys(children).forEach(function (key) {
    if (children[key].market.lowestAsk == 0) return;

    let size = children[key].shoeSize;
    if (size[size.length - 1] === 'W' || size[size.length - 1] === 'Y') {
      size = size.substring(0, size.length - 1);
    }

    pricing[size] = children[key].market.lowestAsk;
  });

  return pricing;
}
