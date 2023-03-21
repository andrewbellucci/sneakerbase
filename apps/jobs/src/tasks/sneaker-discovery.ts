import { logger } from "~utils/logger";
import { collectSneakersFromTraits, collectTraits, processSneakersFound } from "../lib/sneakers";

export default async function() {
  const start = Date.now();
  logger.info("Starting Sneaker Discovery");

  try {
    const traits = await collectTraits();
    const sneakers = await collectSneakersFromTraits(traits);
    await processSneakersFound(sneakers);
    logger.info(`Finished Sneaker Discovery in ${(Date.now() - start) / 1000}s`);
  } catch (error) {
    logger.error(error);
  }
}
