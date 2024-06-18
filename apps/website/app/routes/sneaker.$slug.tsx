
// TODO Extract to file
import {json, LoaderFunctionArgs} from "@remix-run/node";
import SneakerImage from "~/components/SneakerImage";
import {useEffect, useState} from "react";
import {useLoaderData} from "@remix-run/react";
import {SearchResult, searchSneakers} from "~/lib/sneakers";
import Layout from "~/components/Layout";
import Pill from "~/components/Pill";
import Section from "~/components/Section";
import SizeTable from "~/components/SizeTable";
import SneakerCard from "~/components/SneakerCard";

enum Store {
  STOCKX = 'STOCKX',
  GOAT = 'GOAT',
  STADIUMGOODS = 'STADIUMGOODS',
  FLIGHTCLUB = 'FLIGHTCLUB'
}

enum ImageStatus {
  PENDING = 'PENDING',
  PROCESSED = 'PROCESSED',
  PROCESSING = 'PROCESSING',
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  HAS_PLACEHOLDER = 'HAS_PLACEHOLDER',
}


type ProductResponse  = {
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
  imageStatus: ImageStatus;
  derivedColor: string | null;
  derivedSecondaryColor: string | null;
  updatedAt: Date;
  createdAt: Date | null;
} & {prices: {id: string, store: Store, price: number, size: string}[]};

export const loader = async ({ params }: LoaderFunctionArgs) => {
  const res = await fetch('https://api.sneakerbase.io/sneaker/slug/' + params.slug);

  const product: ProductResponse = await res.json();

  return json({
    product
  });
}

export default function SneakerPage() {
  const { product } = useLoaderData<typeof loader>();
  const [relatedProducts, setRelatedProducts] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchSneakers(`${product.make} ${product.colorWay}`)
      .then(searchResults => {
        setRelatedProducts(searchResults.slice(0, 4));
        setLoading(false);
      });
  }, [product.make, product.colorWay]);

  return (
    <Layout>
      <h1
        className={
          "mb-5 font-black text-4xl text-default-black pb-5 border-b border-b-light-gray"
        }
      >
        {product.title}
      </h1>
      <header className={"flex gap-5 mb-[50px] flex-col md:flex-row"}>
        <div
          className={
            "relative flex-1 min-h-[250px] md:min-h-[450px] bg-white border border-light-gray rounded-[22px] overflow-hidden"
          }
        >
          <SneakerImage
            key={product.previewImageUrl}
            src={product.previewImageUrl}
            alt={product.title}
            fill
            className={"object-contain object-center p-10"}
          />
        </div>
        <div className={"md:w-[40%] flex flex-col justify-between gap-5"}>
          <div>
            <div className={"flex items-start justify-between mb-2.5"}>
              <span className={"text-default-black/80 font-semibold text-xl"}>
                {product.colorWay}
              </span>
              <div className={"flex items-center justify-end gap-[5px]"}>
                {/*<TrendingValue value={"$25"} trend={"up"} />*/}
                <Pill>${product.retailPrice}</Pill>
              </div>
            </div>
            <div
              className={
                "bg-white border border-light-gray rounded-[22px] overflow-hidden"
              }
            >
              <div
                className={
                  "border-b border-light-gray last:border-b-0 px-5 py-3.5 flex items-center justify-between gap-5"
                }
              >
              <span className={"font-medium text-secondary text-sm"}>
                Release Date
              </span>
                <span className={"font-semibold text-default-black text-sm"}>
                {product.releaseDate ? new Date(product.releaseDate).toLocaleDateString() : 'N/a'}
              </span>
              </div>
              <div
                className={
                  "border-b border-light-gray last:border-b-0 px-5 py-3.5 flex items-center justify-between gap-5"
                }
              >
              <span className={"font-medium text-secondary text-sm"}>
                Colorway
              </span>
                <span className={"font-semibold text-default-black text-sm"}>
                {product.colorWay}
              </span>
              </div>
              <div
                className={
                  "border-b border-light-gray last:border-b-0 px-5 py-3.5 flex items-center justify-between gap-5"
                }
              >
              <span className={"font-medium text-secondary text-sm"}>
                Brand
              </span>
                <span className={"font-semibold text-default-black text-sm"}>
                {product.make}
              </span>
              </div>
              <div
                className={
                  "border-b border-light-gray last:border-b-0 px-5 py-3.5 flex items-center justify-between gap-5"
                }
              >
                <span className={"font-medium text-secondary text-sm"}>SKU</span>
                <span className={"font-semibold text-default-black text-sm"}>
                {product.sku}
              </span>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Section title={"Pricing"}>
        <SizeTable sizes={product.prices} slug={product.slug} />
      </Section>
      {!loading ? (
        <Section title={"Related Products"}>
          <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"}>
            {relatedProducts.map(relatedProduct => (
              <SneakerCard
                key={relatedProduct.id}
                title={relatedProduct.title}
                imageUrl={relatedProduct.previewImageUrl}
                slug={relatedProduct.slug}
              />
            ))}
          </div>
        </Section>
      ) : undefined}
    </Layout>
  );
}

