import {
  defaultStockXAlgoliaOptions,
  searchStockX,
  SneakerResponse,
} from "../../utils/stockx-algolia";
import {
  promiseAllInBatches,
  promiseAllSettledInBatches,
} from "@sneakerbase/utils";
import { prisma } from "../../utils/prisma";
import { isPlaceholderImage } from "../../utils/is-placeholder-image";
import { processSneakerImage } from "../images";
import { handlePriceProcessing } from "../prices";
import slugify from "slugify";
import { Sentry } from "../../utils/sentry";

async function getSneakerTraits(term = ""): Promise<string[]> {
  const response = await searchStockX(term);
  const traits = new Set<string>();

  response.hits.forEach((hit) => {
    Object.keys(hit.searchable_traits).forEach((key: string) =>
      traits.add(hit.searchable_traits[key]),
    );
  });

  return Array.from(traits);
}

export async function collectTraits(): Promise<string[]> {
  const searchedTerms = new Set<string>();
  let searchTerms = new Set<string>(await getSneakerTraits(""));

  let level = 0;
  const buildSearchTerms = async (terms: Set<string>) => {
    const start = Date.now();
    console.log(`Level ${level} - ${terms.size} terms`);
    let traits = new Set<string>();

    const getAndAdd = async (term: string) => {
      if (searchedTerms.has(term)) return;

      searchedTerms.add(term);
      const newTraits = await getSneakerTraits(term);
      traits = new Set([...traits, ...newTraits]);
    };

    await promiseAllInBatches(getAndAdd, Array.from(terms), 100);

    console.log(
      `Level ${level} Complete - Finished in ${(Date.now() - start) / 1000}s`,
    );

    if (traits.size > 0 && level < 10) {
      console.log("Building new search terms");
      searchTerms = new Set([...searchTerms, ...traits]);
      level++;
      await buildSearchTerms(traits);
    } else {
      console.log("No new search terms, stopping");
    }
  };

  await buildSearchTerms(searchTerms);

  return Array.from(searchTerms);
}

export async function collectSneakersFromTraits(
  traits: string[],
): Promise<SneakerResponse[]> {
  // For each search term, get the sneakers on every page
  const sneakerSkus = new Set<string>();
  const sneakers: SneakerResponse[] = [];

  const gatherSneakersForTerm = async (term: string) => {
    const initialResults = await searchStockX(term);
    const pages = new Array(initialResults.nbPages).fill(0);

    await Promise.all(
      pages.map(async (_, page) => {
        const { hits } = await searchStockX(term, {
          ...defaultStockXAlgoliaOptions,
          page: page + 1,
        });

        hits.forEach((hit) => {
          if (
            hit.style_id &&
            hit.style_id.trim() !== "" &&
            !sneakerSkus.has(hit.style_id)
          ) {
            sneakerSkus.add(hit.style_id);
            sneakers.push(hit);
          }
        });
      }),
    );
  };

  await promiseAllInBatches(gatherSneakersForTerm, traits, 100);
  return Array.from(sneakers);
}

async function processSneaker(sneaker: SneakerResponse) {
  const sku = sneaker.style_id;

  const existingSneaker = await prisma.product.findFirst({
    where: { sku },
  });

  if (existingSneaker) return;

  const imageUrl = sneaker.thumbnail_url || sneaker.media.imageUrl;

  let slugExists = false;
  let iteration = 0;
  let slug = slugify(sneaker.name);
  do {
    slugExists = !!(await prisma.product.findFirst({
      where: { slug },
    }));

    if (slugExists) {
      slug = `${slug}-${iteration}`;
      iteration++;
    }
  } while (slugExists);

  const newSneaker = await prisma.product.create({
    data: {
      title: sneaker.name,
      description: sneaker.description,
      slug,
      colorWay: sneaker.colorway,
      make: sneaker.make,
      retailPrice: sneaker.price,
      sku: sneaker.style_id,
      isPlaceholder: isPlaceholderImage(imageUrl),
      releaseDate:
        sneaker.release_date && sneaker.release_date.trim() !== ""
          ? new Date(sneaker.release_date)
          : null,
      previewImageUrl: isPlaceholderImage(imageUrl)
        ? "https://cdn.sneakerbase.io/products/placeholder.png"
        : imageUrl,
    },
  });

  // await handlePriceProcessing(newSneaker.id);
  await processSneakerImage(newSneaker.id);
}

export async function processSneakersFound(sneakers: SneakerResponse[]) {
  await promiseAllSettledInBatches(processSneaker, sneakers, 15);
}

export async function pickSneakerOfTheDay() {
  try {
    const sneakersAvailable = await prisma.product.count({
      where: {
        isPlaceholder: false,
      },
    });
    const randomIndex = Math.floor(Math.random() * sneakersAvailable);
    const sneaker = await prisma.product.findFirst({
      take: 5,
      skip: randomIndex,
      where: {
        isPlaceholder: false,
      },
    });

    if (!sneaker) return;

    await prisma.sneakerOfTheDay.create({
      data: { productId: sneaker.id },
    });
  } catch (error) {
    Sentry.captureException(error);
  }
}
