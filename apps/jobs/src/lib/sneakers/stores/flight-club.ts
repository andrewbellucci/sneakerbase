import { prisma } from "../../../utils/prisma";
import { Store } from "@sneakerbase/database";
import { generateProxy } from "../../../utils/generate-proxy";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require("promise-retry");
import axios from "axios";
import { Price } from "../types";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const got = require("fix-esm").require('got');

const productDataEndpoint = 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%20(lite)%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(5.7.0)%3B%20JS%20Helper%20(2.28.1)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

export async function processPricing(productId: string): Promise<void> {

  const product = await prisma.product.findUnique({
    where: { id: productId },
    select: { id: true, sku: true, flightClubUrl: true },
  });

  if (!product) throw new Error('Product not found: ' + productId);

  const { prices, url } = await getPricesAndUrl(product.sku);

  if (product.flightClubUrl !== url) {
    await prisma.product.update({
      where: { id: productId },
      data: { flightClubUrl: url }
    });
  }

  const pricesStored = await prisma.price.findMany({
    where: {
      productId,
      store: Store.FLIGHTCLUB,
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
          store: Store.FLIGHTCLUB,
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
}

async function getPricesAndUrl(sku: string): Promise<{ prices: Price[], url: string }> {
  const link = await getProductLink(sku);
  const pricing = await getProductPricing(link);

  return {
    prices: Object.keys(pricing).map((size) => ({
      size,
      price: pricing[size],
    })),
    url: link,
  };
}

async function getProductLink(sku: string): Promise<string> {
  let response = await promiseRetry((retry: any) => {
    return axios.post(
      productDataEndpoint,
      '{"requests":[{"indexName":"product_variants_v2_flight_club","params":"query=' + sku + '&hitsPerPage=1&maxValuesPerFacet=1&filters=&facets=%5B%22lowest_price_cents_usd%22%5D&tagFilters="}]}',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15-API',
        },
        ...generateProxy('http')
        // httpAgent // agent: generateAgent() as unknown,
      },
    ).catch(retry)
  });

  const responseBody = response.data;

  if (
    responseBody.results.length === 0 ||
    responseBody.results[0].hits.length === 0
  ) {
    throw Error(`"${sku}" does not exist.`);
  }

  return 'https://www.flightclub.com/' + responseBody.results[0].hits[0].slug;
}

async function getProductPricing(link: string): Promise<Record<string, number>> {
  let pricingResponse = await promiseRetry(
    (retry: any) => {
      return got.post(
        'https://sneakerbase-serverless.vercel.app/api/flight-club',
        {
          json: {
            slug: link.split('.com/')[1],
          },
        },
      ).catch(retry);
    }
  );

  const responseBody = JSON.parse((pricingResponse.body as string));

  return responseBody.data;
}
