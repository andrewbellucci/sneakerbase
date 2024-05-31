import { promiseAllInBatches, promiseAllSettledInBatches } from "@sneakerbase/utils";
import { prisma } from "../utils/prisma";
import { processPricing as stockXProcessPricing } from './sneakers/stores/stockx';
import { processPricing as goatProcessPricing } from './sneakers/stores/goat';
import { processPricing as flightClubProcessPricing } from './sneakers/stores/flight-club';

const workers = new Set<string>();

export async function handlePriceProcessing(productId: string) {
  if (workers.has(productId)) {
    return false;
  }

  workers.add(productId);

  try {
    await Promise.allSettled([
      stockXProcessPricing(productId),
      goatProcessPricing(productId),
      flightClubProcessPricing(productId),
    ]);

    workers.delete(productId);

    return true;
  } catch {
    workers.delete(productId);

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
    150
  );
}

export async function processAllNonPricedSneakerPrices() {
  const sneakers = await prisma.product.findMany({
    select: { id: true },
    where: {
      prices: { none: {} },
    }
  });

  await promiseAllSettledInBatches(
    (sneaker) => handlePriceProcessing(sneaker.id),
    sneakers,
    150
  );
}
