import {json, MetaFunction} from "@remix-run/node";
import {Link, useLoaderData} from "@remix-run/react";
import Layout from "~/components/Layout";
import Section from "~/components/Section";
import SneakerCard from "~/components/SneakerCard";
import SectionHeading from "~/components/SectionHeading";
import SneakerRow from "~/components/SneakerRow";


interface CondensedSneaker {
  id: string;
  previewImageUrl: string;
  title: string;
  colorWay: string;
  make: string;
  slug: string;
  derivedColor: string | null;
  derivedSecondaryColor: string | null;
  retailPrice: number;
  releaseDate: string | null;
  change?: number;
}

interface SneakerResponse {
  id: string;
  title: string;
  colorWay: string;
  make: string;
  retailPrice: number;
  sku: string;
  slug: string;
  releaseDate: string | null;
  previewImageUrl: string;
  description: string;
  isPlaceholder: boolean;
  stockXUrl: string | null;
  goatUrl: string | null;
  flightClubUrl: string | null;
  derivedColor: string | null;
  derivedSecondaryColor: string | null;
  updatedAt: string;
  createdAt: string | null;
  change?: number;
}

function condenseInfo(sneaker: SneakerResponse): CondensedSneaker {
  return {
    id: sneaker.id,
    previewImageUrl: sneaker.previewImageUrl,
    title: sneaker.title,
    colorWay: sneaker.colorWay,
    make: sneaker.make,
    slug: sneaker.slug,
    derivedColor: sneaker.derivedColor,
    derivedSecondaryColor: sneaker.derivedSecondaryColor,
    retailPrice: sneaker.retailPrice,
    releaseDate: sneaker.releaseDate,
  }
}

export const loader = async () => {
  const sneakerOfTheDayRes = await fetch('https://api.sneakerbase.io/web-data/product-of-the-day', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  }).catch();
  const newSneakersRes = await fetch('https://api.sneakerbase.io/web-data/new-products', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  });
  const topVisitedSneakersRes = await fetch('https://api.sneakerbase.io/web-data/top-products', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  });
  const topRatedSneakersRes = await fetch('https://api.sneakerbase.io/web-data/top-rated', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  });
  const biggestPriceJumpsRes = await fetch('https://api.sneakerbase.io/web-data/biggest-price-jumps', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  });
  const biggestPriceDumpsRes = await fetch('https://api.sneakerbase.io/web-data/biggest-price-drops', {
    headers: { Authorization: `${process.env.WEB_TOKEN}` }
  });

  const sneakerOfTheDay = sneakerOfTheDayRes.status === 404 ? undefined : await sneakerOfTheDayRes.json() as SneakerResponse
  const newSneakers = await newSneakersRes.json() as SneakerResponse[]
  const topVisitedSneakers = await topVisitedSneakersRes.json() as SneakerResponse[]
  const topRatedSneakers = await topRatedSneakersRes.json() as SneakerResponse[]
  const biggestPriceJumps = await biggestPriceJumpsRes.json() as SneakerResponse[]
  const biggestPriceDumps = await biggestPriceDumpsRes.json() as SneakerResponse[]

  return json({
    sneakerOfTheDay: sneakerOfTheDay ? condenseInfo(sneakerOfTheDay) : null,
    newSneakers: newSneakers.map(condenseInfo),
    topVisitedSneakers: topVisitedSneakers.map(condenseInfo),
    topRatedSneakers: topRatedSneakers.map(condenseInfo),
    biggestPriceJumps: biggestPriceJumps.map(condenseInfo),
    biggestPriceDumps: biggestPriceDumps.map(condenseInfo),
  });
}

export default function Home() {
  const { sneakerOfTheDay, newSneakers, topVisitedSneakers, topRatedSneakers,  biggestPriceJumps, biggestPriceDumps } = useLoaderData<typeof loader>();
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const day = today.getDate();

  return (
    <Layout noContainer>
      {sneakerOfTheDay ? (
        <header className={'bg-white shadow-[0_0_80px_80px_white]'}>
          <div className={'container py-[50px] lg:py-0 lg:h-[400px] flex flex-col lg:flex-row items-center justify-between gap-8'}>
            <img
              src={sneakerOfTheDay.previewImageUrl}
              alt={sneakerOfTheDay.title}
              width={400}
              height={250}
            />
            <div className={'relative z-[10]'}>
            <span className={'font-semibold block text-default-black/50'}>
              {month} {day} Sneaker of the Day
            </span>
              <h3 className={"font-black text-default-black text-3xl lg:text-[50px] lg:leading-[63px]"}>
                {sneakerOfTheDay.title}
              </h3>
              <span className={'font-bold text-primary text-2xl mb-4 block'}>
              {sneakerOfTheDay.colorWay}
            </span>
              <Link
                className={'font-semibold rounded-[10px] transition-opacity hover:opacity-90 bg-primary text-white h-9 px-4 text-sm inline-flex items-center justify-center'}
                to={`/sneaker/${sneakerOfTheDay.slug}`}
              >
                View Now
              </Link>
            </div>
          </div>
        </header>
      ) : undefined}

      <div className={'container mx-auto pb-20'}>
        {/*<FeatureHeader {...sneakerOfTheDay} />*/}
        <Section title={"Price Jumps"}>
          <div className={"grid grid-cols-1 sm:grid-cols-2 lg:flex gap-5"}>
            {biggestPriceJumps.map((sneaker, index) => (
              <SneakerCard
                key={sneaker.id}
                title={sneaker.title}
                retailPrice={sneaker.retailPrice}
                imageUrl={sneaker.previewImageUrl}
                slug={sneaker.slug}
                trend={sneaker.change ? "up" : undefined}
                trendValue={sneaker.change ? `$${sneaker.change}` : undefined}
              />
            ))}
          </div>
        </Section>
        <Section title={"Price Dumps"}>
          <div className={"grid grid-cols-1 sm:grid-cols-2 lg:flex gap-5"}>
            {biggestPriceDumps.map((sneaker, index) => (
              <SneakerCard
                key={sneaker.id}
                title={sneaker.title}
                retailPrice={sneaker.retailPrice}
                imageUrl={sneaker.previewImageUrl}
                slug={sneaker.slug}
                trend={sneaker.change ? "down" : undefined}
                trendValue={sneaker.change ? `$${sneaker.change}` : undefined}
              />
            ))}
          </div>
        </Section>
        <Section>
          <div
            className={
              "flex gap-[50px] md:gap-5 lg:gap-[50px] flex-col md:flex-row"
            }
          >
            <div className={"flex-1 overflow-hidden"}>
              <SectionHeading>Top Viewed</SectionHeading>
              <div className={"flex flex-col gap-2.5 overflow-hidden"}>
                {topVisitedSneakers.map((sneaker, index) => (
                  <SneakerRow
                    key={sneaker.id}
                    label={`${index + 1}`}
                    title={sneaker.title}
                    retailPrice={sneaker.retailPrice}
                    imageUrl={sneaker.previewImageUrl}
                    slug={sneaker.slug}
                    // trend={"up"}
                    // trendValue={"$25"}
                  />
                ))}
              </div>
            </div>
            <div className={"flex-1 overflow-hidden"}>
              <SectionHeading>Top Up-Voted</SectionHeading>
              <div className={"flex-1 flex flex-col gap-2.5 overflow-hidden"}>
                {topRatedSneakers.map((sneaker, index) => (
                  <SneakerRow
                    key={sneaker.id}
                    label={`${index + 1}`}
                    title={sneaker.title}
                    retailPrice={sneaker.retailPrice}
                    imageUrl={sneaker.previewImageUrl}
                    slug={sneaker.slug}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        <Section title={"Newly Sourced"}>
          <div className={"grid grid-cols-1 sm:grid-cols-2 lg:flex gap-5"}>
            {newSneakers.map(sneaker => (
              <SneakerCard
                key={sneaker.id}
                title={sneaker.title}
                retailPrice={sneaker.retailPrice}
                releaseDate={sneaker.releaseDate}
                imageUrl={sneaker.previewImageUrl}
                slug={sneaker.slug}
              />
            ))}
          </div>
        </Section>
      </div>
    </Layout>
  );
}