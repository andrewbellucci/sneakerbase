import { logger } from "@sneakerbase/utils";
import { collectSneakersFromTraits, collectTraits, processSneakersFound } from "../lib/sneakers";
import schedule from "node-schedule";
import { EVERY_DAY_AT_MIDNIGHT } from "src/utils/cron";

export default async function() {
  schedule.scheduleJob(EVERY_DAY_AT_MIDNIGHT, async function () {
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
  });
}
