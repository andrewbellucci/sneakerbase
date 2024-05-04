import { promiseAllInBatches, promiseAllSettledInBatches } from "@sneakerbase/utils";
import { prisma } from "../utils/prisma";
import { processPricing as stockXProcessPricing } from './sneakers/stores/stockx';
import { processPricing as goatProcessPricing } from './sneakers/stores/goat';
import { processPricing as flightClubProcessPricing } from './sneakers/stores/flight-club';

export async function handlePriceProcessing(productId: string) {
  try {
    await Promise.allSettled([
      stockXProcessPricing(productId),
      goatProcessPricing(productId),
      flightClubProcessPricing(productId),
    ]);
    return true;
  } catch {
    return false;
  }
}

export async function processAllSneakerPrices() {
  const sneakers = await prisma.product.findMany({
    select: { id: true },
  });

  await promiseAllSettledInBatches(
    (sneaker) => handlePriceProcessing(sneaker.id),
    sneakers,
    10
  );
}
