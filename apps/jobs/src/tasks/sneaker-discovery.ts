import { logger } from "@sneakerbase/utils";
import {
  collectSneakersFromTraits,
  collectTraits,
  processSneakersFound,
} from "../lib/sneakers";
import schedule from "node-schedule";
import { EVERY_DAY_AT_1_40AM, EVERY_DAY_AT_2_15PM } from "../utils/cron";
// import Typesense from "typesense";

// let booksSchema = {
//   name: "products",
//   fields: [
//     { name: "title", type: "string" },
//     { name: "colorWay", type: "string" },
//     { name: "make", type: "string" },
//   ],
// };

export default async function () {
  console.log("Scheduling sneaker discovery job");

  schedule.scheduleJob(EVERY_DAY_AT_2_15PM, async function () {
    const start = Date.now();
    logger.info("Starting Sneaker Discovery");

    try {
      const traits = await collectTraits();
      const sneakers = await collectSneakersFromTraits(traits);
      await processSneakersFound(sneakers);

      // Recreate index for search

      logger.info(
        `Finished Sneaker Discovery in ${(Date.now() - start) / 1000}s`,
      );
    } catch (error) {
      logger.error(error);
    }
  });
}
