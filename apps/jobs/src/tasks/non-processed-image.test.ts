import { expect, test } from "vitest";
import { processSneakerImage } from "../lib/images";
import { prisma } from "../utils/prisma";

test("with non-processed images", async () => {
  const firstProduct = await prisma.product.findFirst();
  expect(firstProduct).toBeDefined();
  expect(firstProduct).not.toBeNull();
  if (!firstProduct) return;

  const imageProcessed = await processSneakerImage(firstProduct.id);

  expect(imageProcessed).toBe(true);
});
