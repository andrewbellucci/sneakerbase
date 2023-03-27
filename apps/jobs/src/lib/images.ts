import { prisma } from "../utils/prisma";
import { ImageStatus } from "@sneakerbase/database";
import { logger, promiseAllInBatches } from "@sneakerbase/utils";
import { searchStockX } from "../utils/stockx-algolia";
import { isPlaceholderImage } from "../utils/is-placeholder-image";
import { transformProductImageUrl } from "@sneakerbase/utils";
import { downloadImage } from "@sneakerbase/utils";
import { uploadFile } from "../utils/storage";
import { Sentry } from "src/utils/sentry";
const Vibrant = require('node-vibrant');

const ImageNeedsProcessing = {
  OR: [
    { imageStatus: ImageStatus.FAILED },
    { imageStatus: ImageStatus.REJECTED },
    { imageStatus: ImageStatus.PENDING },
    { imageStatus: ImageStatus.HAS_PLACEHOLDER },
    { isPlaceholder: true },
  ],
};

const bucketName = 'products';

export async function processSneakerImage(productId: string) {
  const existingProduct = await prisma.product.findFirst({
    select: { id: true, imageStatus: true, isPlaceholder: true, sku: true },
    where: { id: productId },
  });

  if (!existingProduct) return;

  try {
    // Double check that the image hasn't already been processed
    const foundProducts = await searchStockX(existingProduct.sku);

    if (!existingProduct || !foundProducts.hits[0]) return;

    const foundProduct = foundProducts.hits[0];
    const imageUrl = foundProduct.media.imageUrl || foundProduct.thumbnail_url;

    // Skip placeholder images
    if (isPlaceholderImage(imageUrl)) return await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        isPlaceholder: true,
        imageStatus: ImageStatus.HAS_PLACEHOLDER,
      },
    });

    // Transform URL for proper processing
    const transformedUrl = transformProductImageUrl(imageUrl);

    // Process image if non-existent
    const imageName = existingProduct.id + '.png';
    const downloadedImage: Buffer = await downloadImage(transformedUrl);

    // Derive vibrant color from the image
    const colorPalette = await Vibrant.from(transformedUrl).getPalette();

    // Upload image to Storage Service
    await uploadFile(downloadedImage, imageName, bucketName, 'image/png');

    const imageLink = `https://cdn.sneakerbase.io/${bucketName}/${imageName}`;

    // Update product with new URL, derived color hex, and processedImage columns
    await prisma.product.update({
      where: { id: existingProduct.id },
      data: {
        previewImageUrl: imageLink,
        derivedColor: colorPalette.Vibrant.hex,
        derivedSecondaryColor: colorPalette.DarkVibrant.hex,
        imageStatus: ImageStatus.PROCESSED,
        isPlaceholder: false,
      },
    });
  } catch (error) {
    logger.error(error);
    Sentry.captureException(error);
    await prisma.product.update({
      where: { id: existingProduct.id },
      data: { imageStatus: ImageStatus.FAILED },
    });
  }
}

export async function processSneakerImages() {
  // For each page of products, add product to array of products
  const products =  await prisma.product.findMany({
    select: { id: true },
    where: ImageNeedsProcessing,
  });

  await promiseAllInBatches(
    async product => await processSneakerImage(product.id),
    products,
    25,
  );
}
