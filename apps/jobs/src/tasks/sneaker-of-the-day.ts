import { logger } from "@sneakerbase/utils";
import { pickSneakerOfTheDay } from "../lib/sneakers";
import schedule from "node-schedule";
import { EVERY_DAY_AT_MIDNIGHT } from "src/utils/cron";

export default async function() {
  schedule.scheduleJob(EVERY_DAY_AT_MIDNIGHT, async function () {
    const start = Date.now();
    logger.info("Starting Sneaker of the Day Pick");

    try {
      await pickSneakerOfTheDay();
      logger.info(`Finished Sneaker of the Day Pick in ${(Date.now() - start) / 1000}s`);
    } catch (error) {
      logger.error(error);
    }
  });
}
