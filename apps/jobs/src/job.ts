import sneakerDiscovery from "./tasks/sneaker-discovery";
import processPrices from "./tasks/process-prices";


console.log("Scheduling jobs");

// Start the sneaker discovery task
void sneakerDiscovery();

// Start the sneaker price processing task
void processPrices();

console.log("Jobs scheduled");
