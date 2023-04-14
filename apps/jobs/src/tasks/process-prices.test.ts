import { expect, test } from "vitest";
import { prisma } from "../utils/prisma";
import { handlePriceProcessing } from "src/lib/prices";

test("with price processing for a sneaker", async () => {
  const firstProduct = await prisma.product.findFirst();
  expect(firstProduct).toBeDefined();
  expect(firstProduct).not.toBeNull();
  if (!firstProduct) return;

  const imageProcessed = await handlePriceProcessing(firstProduct.id);

  expect(imageProcessed).toBe(true);
}, { timeout: 120_000 }); // 120 second timeout because it can take a while
