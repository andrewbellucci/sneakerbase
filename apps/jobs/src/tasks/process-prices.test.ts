import { expect, test } from "vitest";
import { prisma } from "../utils/prisma";
import { handlePriceProcessing } from "../lib/prices";
import {processPricing as stockXProcessPricing} from "../lib/sneakers/stores/stockx";
import {processPricing as goatProcessPricing} from "src/lib/sneakers/stores/goat";
import {processPricing as flightClubProcessPricing} from "src/lib/sneakers/stores/flight-club";

test("with stockx price processing for a sneaker", async () => {
  const firstProduct = await prisma.product.findFirst({
    where: {
      id: "68b283de-74d7-424c-af43-3b58ced37e8f"
    }
  });
  expect(firstProduct).toBeDefined();
  expect(firstProduct).not.toBeNull();
  if (!firstProduct) return;

  // const priceProcessed = await handlePriceProcessing(firstProduct.id);
  let priceProcessed = false;
  try {
    await flightClubProcessPricing(firstProduct.id);
    priceProcessed = true;
  } catch (e) {
    console.error(e);
  }

  expect(priceProcessed).toBe(true);
}, { timeout: 120_000 }); // 120 second timeout because it can take a while
