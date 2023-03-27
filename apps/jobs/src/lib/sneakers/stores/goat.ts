import { prisma } from "../../../utils/prisma";
import { Store } from "@sneakerbase/database";
import { generateProxy, generateProxyString } from "../../../utils/generate-proxy";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const cloudscraper = require("cloudscraper");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const promiseRetry = require("promise-retry");
import axios from "axios";
import { Price } from "../types";
import { Sentry } from "src/utils/sentry";

const productDataEndpoint = 'https://2fwotdvm2o-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20vanilla%20JavaScript%20(lite)%203.25.1%3Breact%20(16.9.0)%3Breact-instantsearch%20(6.2.0)%3BJS%20Helper%20(3.1.0)&x-algolia-application-id=2FWOTDVM2O&x-algolia-api-key=ac96de6fef0e02bb95d433d8d5c7038a';

export async function processPricing(productId: string): Promise<void> {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: { id: true, sku: true, goatUrl: true },
    });

    if (!product) throw new Error(`Product with id ${productId} not found`);

    const { prices, url } = await getPricesAndUrl(product.sku);

    if (product.goatUrl !== url) {
      await prisma.product.update({
        where: { id: productId },
        data: { goatUrl: url }
      });
    }

    const pricesStored = await prisma.price.findMany({
      where: {
        productId,
        store: Store.GOAT,
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
            store: Store.GOAT,
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
  const { templateId, url } = await getProductData(sku);
  const pricing = await getProductPricing(templateId);

  return {
    prices: Object.keys(pricing).map(size => ({
      size,
      price: pricing[size],
    })),
    url
  };
}

async function getProductData(sku: string): Promise<{ templateId: string; url: string }> {
  let response = await promiseRetry((retry: any) => {
    return axios.post(
      productDataEndpoint,
      '{"requests":[{"indexName":"product_variants_v2","params":"distinct=true&maxValuesPerFacet=1&page=0&query=' + sku + '&facets=%5B%22instant_ship_lowest_price_cents"}]}',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.4 Safari/605.1.15',
          'Content-Type': 'application/json'
        },
        ...generateProxy('http'),
      }).catch(retry)
  });


  const responseBody = response.data

  if (
    responseBody.results.length === 0 ||
    responseBody.results[0].hits.length === 0
  ) {
    throw Error(`"${sku}" does not exist.`);
  }

  const product = responseBody.results[0].hits[0];

  if (!product || !product.product_template_id) throw Error(`"${sku}" does not exist.`);

  return {
    templateId: product.product_template_id as string,
    url: 'https://www.goat.com/sneakers/' + product.slug as string,
  }
}

async function getProductPricing(templateId: string): Promise<Record<string, number>> {
  const apiLink = 'https://www.goat.com/web-api/v1/product_variants/buy_bar_data?productTemplateId='
    + templateId
    + '&countryCode=US';

  let response = await promiseRetry((retry: any) => {
      return cloudscraper.get(apiLink, {
        proxy: generateProxyString('http'),
      }).catch(retry);
    });

  const pricingBody = JSON.parse(response);
  const pricing: Record<string, number> = {};

  pricingBody.forEach((option: any) => {
    const size = option.sizeOption.value as string;

    if (option.stockStatus === 'not_in_stock') {
      pricing[size] = option.lastSoldPriceCents.amount / 100;
    }

    if (option.shoeCondition === 'new_no_defects') {
      if (pricing[size]) {
        pricing[size] =
          option.lowestPriceCents.amount / 100 < pricing[size]
            ? option.lowestPriceCents.amount / 100
            : pricing[size];
      } else {
        pricing[size] = option.lowestPriceCents.amount / 100;
      }
    }
  });

  return pricing;
}
