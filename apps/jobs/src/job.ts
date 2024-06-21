import { createClient } from "redis";
import sneakerDiscovery from "./tasks/sneaker-discovery";
import processPrices from "./tasks/process-prices";
import { handlePriceProcessing } from "./lib/prices";
import { env } from "./utils/env";
import sneakerOfTheDay from "src/tasks/sneaker-of-the-day";
import {pickSneakerOfTheDay} from "src/lib/sneakers";

console.log("Scheduling jobs");

// Start the sneaker discovery task
void sneakerDiscovery();

// Start the sneaker price processing task
// void processPrices();

void sneakerOfTheDay()

console.log("Jobs scheduled");

(async function startTaskListeners() {
  console.log("Scheduling task listeners");

  const client = await createClient({
    url: env.REDIS_URL,
  })
    .on("error", (err) => console.log("Redis Client Error", err))
    .connect();

  // Handle price processing for updates, and non priced sneakers.
  await client.subscribe("update-pricing", handlePriceProcessing);

  // On the fly SotD
  await client.subscribe("gen-sotd", pickSneakerOfTheDay);

  console.log("Scheduled task listeners");
})();
