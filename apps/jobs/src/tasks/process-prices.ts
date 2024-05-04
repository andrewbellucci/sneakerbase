import { logger } from "@sneakerbase/utils";
import { processAllSneakerPrices } from "../lib/prices";
import schedule from "node-schedule";
import {EVERY_DAY_AT_5_30AM, EVERY_DAY_AT_5AM, EVERY_SUNDAY_AT_MIDNIGHT} from "../utils/cron";

export default async function () {
  logger.info("Scheduling sneaker prices job");

  schedule.scheduleJob(EVERY_DAY_AT_5_30AM, async function () {
    const start = Date.now();
    logger.info("Starting Processing of all Sneaker Prices");

    try {
      await processAllSneakerPrices();
      logger.info(
        `Finished Processing of all Sneaker Prices in ${
          (Date.now() - start) / 1000
        }s`
      );
    } catch (error) {
      logger.error(error);
    }
  });
}
