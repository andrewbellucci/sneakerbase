import {generateProxy, generateProxyString} from "../../../utils/generate-proxy";
import { prisma } from "../../../utils/prisma";
import { Store } from "@sneakerbase/database";
import { searchStockX } from "../../../utils/stockx-algolia";
import { Price } from "../types";
import { Sentry } from "../../../utils/sentry";
import * as cheerio from "cheerio";
import axios from "axios";
import request from "request-promise"
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudscraper = require("cloudscraper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require("promise-retry");

// eslint-disable-next-line @typescript-eslint/no-var-requires
const Humanoid = require("humanoid-js");

const humanoid = new Humanoid();

import { fetch as fH2 } from 'fetch-http2'


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

    if (!product) return;


    const { prices, url } = await getPricesAndUrl(product.sku);
    console.log(prices)
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
  console.log('product found, finding pricing')

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
  const res = await request({
    url: 'https://stockx.com/' + link.split('.com/')[1],
    proxy: 'http://brd-customer-hl_07097a4d-zone-sneakerbase:f5b3z7cw5624@brd.superproxy.io:22225',
    rejectUnauthorized: false
  })
  const $ = cheerio.load(res);

  const nextData = JSON.parse($('#__NEXT_DATA__').html() ?? "");

  const productData: any = nextData.props.pageProps.req.appContext.states.query.value.queries.find(
    (query: any) => query.queryKey.includes('GetProduct')
  );
  const variants: {
    market: {
      state: {
        lowestAsk: {
          amount: number
        } | null;
      };
    };
    sizeChart: {
      displayOptions: {
        size: string;
        type: string;
      }[]
    }
  }[] = productData.state.data.product.variants;

  const pricing: Record<string, number> = {};

  variants.forEach(function (variant) {
    if (variant.market.state.lowestAsk === null) return;
    if (variant.market.state.lowestAsk.amount === 0) return;

    const usSize = variant.sizeChart.displayOptions.find(option => option.type === "us m");
    if (!usSize) return;

    let size = usSize.size.replace('US M ', '');

    pricing[size] = variant.market.state.lowestAsk.amount;
  });

  return pricing;
}
