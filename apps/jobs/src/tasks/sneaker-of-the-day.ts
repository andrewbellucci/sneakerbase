import { logger } from "@sneakerbase/utils";
import { pickSneakerOfTheDay } from "../lib/sneakers";

export default async function() {
  const start = Date.now();
  logger.info("Starting Sneaker of the Day Pick");

  try {
    await pickSneakerOfTheDay();
    logger.info(`Finished Sneaker of the Day Pick in ${(Date.now() - start) / 1000}s`);
  } catch (error) {
    logger.error(error);
  }
}
