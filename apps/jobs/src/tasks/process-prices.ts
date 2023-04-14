import { logger } from "@sneakerbase/utils";
import { processAllSneakerPrices } from "../lib/prices";
import schedule from "node-schedule";
import { EVERY_FRIDAY_AT_4_45PM } from "../utils/cron";

export default async function () {
  schedule.scheduleJob(EVERY_FRIDAY_AT_4_45PM, async function () {
    const start = Date.now();
    logger.info("Starting Processing of all Sneaker Prices");

    try {
      await processAllSneakerPrices();
      logger.info(`Finished Processing of all Sneaker Prices in ${(Date.now() - start) / 1000}s`);
    } catch (error) {
      logger.error(error);
    }
  });
}
