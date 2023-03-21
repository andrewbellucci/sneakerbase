import { logger } from "@sneakerbase/utils";
import { processAllSneakerPrices } from "../lib/prices";

export default async function() {
  const start = Date.now();
  logger.info("Starting Processing of all Sneaker Prices");

  try {
    await processAllSneakerPrices();
    logger.info(`Finished Processing of all Sneaker Prices in ${(Date.now() - start) / 1000}s`);
  } catch (error) {
    logger.error(error);
  }
}
