import { promiseAllInBatches } from "@sneakerbase/utils";
import { prisma } from "../utils/prisma";
import { processPricing as stockXProcessPricing } from './sneakers/stores/stockx';
import { processPricing as goatProcessPricing } from './sneakers/stores/goat';
import { processPricing as flightClubProcessPricing } from './sneakers/stores/flight-club';

export async function handlePriceProcessing(productId: string) {
  await Promise.allSettled([
    stockXProcessPricing(productId),
    goatProcessPricing(productId),
    flightClubProcessPricing(productId),
  ]);
}

export async function processAllSneakerPrices() {
  const sneakers = await prisma.product.findMany({
    select: { id: true },
  });

  await promiseAllInBatches(
    (sneaker) => handlePriceProcessing(sneaker.id),
    sneakers,
    50
  );
}
