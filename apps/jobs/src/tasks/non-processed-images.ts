import { logger } from "@sneakerbase/utils";
import { processSneakerImages } from "../lib/images";

export default async function() {
  const start = Date.now();
  logger.info("Starting Image Processing of non-processed products");

  try {
    await processSneakerImages();
    logger.info(`Finished Image Processing of non-processed products in ${(Date.now() - start) / 1000}s`);
  } catch (error) {
    logger.error(error);
  }
}
