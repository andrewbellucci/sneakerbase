import { Children, PropsWithChildren, useEffect, useMemo, useState } from "react";
import StockXIcon from "~/components/icons/StockXIcon";
import GoatIcon from "~/components/icons/GoatIcon";
import SizeIcon from "~/components/icons/SizeIcon";
import FlightClubIcon from "~/components/icons/FlightClubIcon";
import { useMediaQuery } from "react-responsive";
import Pill from "~/components/Pill";
import {Link} from "@remix-run/react";

interface SizeOption {
  size: string;
  locale: "US" | "UK" | "EU";
}

const SIZES: SizeOption[] = [
  { size: "4.5", locale: "US" },
  { size: "5", locale: "US" },
  { size: "5.5", locale: "US" },
  { size: "6", locale: "US" },
  { size: "6.5", locale: "US" },
  { size: "7", locale: "US" },
  { size: "7.5", locale: "US" },
  { size: "8", locale: "US" },
  { size: "8.5", locale: "US" },
  { size: "9", locale: "US" },
  { size: "9.5", locale: "US" },
  { size: "10", locale: "US" },
  { size: "10.5", locale: "US" },
  { size: "11", locale: "US" },
  { size: "11.5", locale: "US" },
  { size: "12", locale: "US" },
  { size: "12.5", locale: "US" },
  { size: "13", locale: "US" },
  { size: "13.5", locale: "US" },
  { size: "14", locale: "US" },
  { size: "14.5", locale: "US" },
  { size: "15", locale: "US" },
  { size: "15.5", locale: "US" },
  { size: "16", locale: "US" },
  { size: "16.5", locale: "US" },
  { size: "17", locale: "US" },
  { size: "17.5", locale: "US" },
  { size: "18", locale: "US" },
];

interface GridRowProps {
  HeaderIcon: JSX.Element;
  headerText: string;
}

function GridRow({
   HeaderIcon,
   headerText,
   children,
 }: PropsWithChildren<GridRowProps>) {
  const [rendered, setRendered] = useState(false);
  const isSmallScreen = useMediaQuery({
    query: "(max-width: 640px)",
  });
  const childLength = useMemo(() => {
    return Children.toArray(children).length;
  }, [children]);

  useEffect(() => {
    setRendered(true);
  }, []);

  return (
    <div
      key={rendered ? 'rendered' : 'not-rendered'} // This is a hack to force a rerender, so that the width is correct
      className={`border-b border-light-gray whitespace-nowrap relative last:border-b-0 group`}
      style={{
        width: isSmallScreen ? `${childLength * 100 + 56}px` : `${childLength * 100 + 140}px`,
      }}
    >
      <div
        className={
          "sticky left-0 font-bold sm:w-[140px] bg-white/80 border-r border-r-light-gray backdrop-blur text-left text-sm h-[56px] relative p-2.5 inline-flex items-center justify-start gap-2.5 z-[2] align-top group-first:rounded-tl-[12px] group-last:rounded-bl-[22px]"
        }
      >
        {HeaderIcon}
        <span className={"hidden sm:inline-block"}>{headerText}</span>
      </div>
      {children}
    </div>
  );
}

interface SizeOptionProps {
  option: SizeOption;
}
function SizeOption({ option }: SizeOptionProps) {
  return (
    <div
      className={
        "inline-block font-bold text-center h-[56px] border-r border-light-gray last:border-r-0 text-[22px] leading-[28px] w-[100px]"
      }
    >
      <span className={"block relative -bottom-1.5"}>{option.size}</span>
      <span
        className={
          "text-default-black/80 font-medium text-sm relative -top-1.5"
        }
      >
        {option.locale}
      </span>
    </div>
  );
}

enum Store {
  STOCKX = 'STOCKX',
  GOAT = 'GOAT',
  STADIUMGOODS = 'STADIUMGOODS',
  FLIGHTCLUB = 'FLIGHTCLUB'
}

interface SizeTableProps {
  sizes: {id: string, store: Store, price: number, size: string}[];
  slug: string;
}

function mapSizes(sizes: {id: string, store: Store, price: number, size: string}[], store: Store) {
  return SIZES.map(sizeOption => {
    const size = sizes.find(
      sizeAvailable => sizeAvailable.size === sizeOption.size && sizeAvailable.store === store
    );

    if (!size) {
      return null;
    }

    const isBestPrice = sizes.reduce((acc, curr) => {
      if (curr.size === sizeOption.size && curr.store !== store) {
        return acc && curr.price > size.price;
      }
      return acc;
    }, true);

    return {
      ...size,
      isBestPrice
    };
  })
}

export default function SizeTable({ sizes, slug }: SizeTableProps) {
  const stockXSizes = useMemo(() => {
    return mapSizes(sizes, Store.STOCKX);
  }, []);
  const goatSizes = useMemo(() => {
    return mapSizes(sizes, Store.GOAT);
  }, []);
  const flightClubSizes = useMemo(() => {
    return mapSizes(sizes, Store.FLIGHTCLUB);
  }, []);

  return (
    <div className={'rounded-[12px] border border-light-gray overflow-hidden bg-white'}>
      <div className="overflow-x-auto">
        <GridRow HeaderIcon={<SizeIcon />} headerText={"Size"}>
          {SIZES.map((option) => (
            <SizeOption key={option.size} option={option} />
          ))}
        </GridRow>
        <GridRow HeaderIcon={<StockXIcon />} headerText={"StockX"}>
          {stockXSizes.map((size, index) => (
            <Link
              to={`https://snkrl.ink/${slug}?store=${Store.STOCKX}`}
              key={index}
              className={
                "inline-flex items-center justify-center h-[56px] w-[100px] border-r border-light-gray last:border-r-0"
              }
            >
              <Pill green={size ? size.isBestPrice : false}>
                {size ? `$${size.price}` : "N/A"}
              </Pill>
            </Link>
          ))}
        </GridRow>
        <GridRow HeaderIcon={<GoatIcon />} headerText={"GOAT"}>
          {goatSizes.map((size, index) => (
            <Link
              to={`https://snkrl.ink/${slug}?store=${Store.GOAT}`}
              key={index}
              className={
                "inline-flex items-center justify-center h-[56px] w-[100px] border-r border-light-gray last:border-r-0"
              }
            >
              <Pill green={size ? size.isBestPrice : false}>
                {size ? `$${size.price}` : "N/A"}
              </Pill>
            </Link>
          ))}
        </GridRow>
        <GridRow HeaderIcon={<FlightClubIcon />} headerText={"Flight Club"}>
          {flightClubSizes.map((size, index) => (
            <Link
              to={`https://snkrl.ink/${slug}?store=${Store.FLIGHTCLUB}`}
              key={index}
              className={
                "inline-flex items-center justify-center h-[56px] w-[100px] border-r border-light-gray last:border-r-0"
              }
            >
              <Pill green={size ? size.isBestPrice : false}>
                {size ? `$${size.price}` : "N/A"}
              </Pill>
            </Link>
          ))}
        </GridRow>
      </div>
    </div>
  );
}
