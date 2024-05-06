import { createClient } from 'redis';
import sneakerDiscovery from "./tasks/sneaker-discovery";
import processPrices from "./tasks/process-prices";
import {handlePriceProcessing} from "src/lib/prices";
import {env} from "src/utils/env";



console.log("Scheduling jobs");

// Start the sneaker discovery task
void sneakerDiscovery();

// Start the sneaker price processing task
void processPrices();

console.log("Jobs scheduled");

(async function startTaskListeners() {
  console.log('Scheduling task listeners');

  const client = await createClient({
    url: env.REDIS_URL
  })
    .on('error', err => console.log('Redis Client Error', err))
    .connect();

  // Handle price processing for updates, and non priced sneakers.
  await client.subscribe('update-pricing', handlePriceProcessing);

  console.log('Scheduled task listeners');
})();


