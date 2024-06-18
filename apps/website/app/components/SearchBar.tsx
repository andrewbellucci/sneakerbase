import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import SearchIcon from "~/components/icons/SearchIcon";
import SneakerImage from "~/components/SneakerImage";
import { SearchResult, searchSneakers } from "~/lib/sneakers";
import {useOnClickOutside} from "usehooks-ts";
import {Link} from "@remix-run/react";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([])
  const searchAreaRef = useRef<HTMLDivElement>(null)
  const handleInputFocus = () => {
    ref.current && ref.current.focus();
  }
  const handleInputBlur = () => {
    ref.current && ref.current.blur();
    setFocused(false);
  };

  useEffect(() => {
    const commandK = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        handleInputFocus();
      }

      if (e.key === "Escape") {
        handleInputBlur();
      }

      if (e.key === "Enter") {
        handleInputBlur();
      }
    };
    document.addEventListener("keydown", commandK);

    return () => document.removeEventListener("keydown", commandK);
  }, []);

  useEffect(() => {
    searchSneakers(query).then(setResults);
  }, [query]);

  useOnClickOutside(searchAreaRef, () => setFocused(false))

  return (
    <div
      ref={searchAreaRef}
      className={'flex-1 flex justify-center'}>
      <div
        onClick={handleInputFocus}
        className={clsx(
          "max-w-[500px] flex-1 text-sm font-medium rounded-[10px] flex items-center h-10 cursor-text gap-2.5 pl-3 pr-2 border transition-colors duration-200",
          focused
            ? results.length !== 0 ? "border-default-black/10 bg-white rounded-b-none" : "bg-default-black/5 border-transparent"
            : "bg-default-black/5 border-transparent"
        )}
      >
        <SearchIcon />
        <input
          className={
            "bg-transparent outline-0 placeholder-secondary text-default-black flex-1"
          }
          type="text"
          ref={ref}
          placeholder={"Search Sneakerbase"}
          onFocus={() => setFocused(true)}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <span
          className={
            "text-[11px] text-secondary h-[22px] px-1 bg-white border border-light-gray inline-flex items-center justify-center rounded-[5px]"
          }
        >
        ⌘ K
      </span>
      </div>
      <div
        className={clsx(
          'absolute top-full max-w-[500px] w-full rounded-b-[10px] drop-shadow-2xl overflow-hidden border-l border-r border-b border-t-none border-light-gray ',
          focused ? results.length !== 0 ? 'block' : 'hidden' : 'hidden'
        )}
      >
        {results.map((result) => (
          <Link
            key={result.id}
            to={`/sneaker/${result.slug}`}
            onClick={() => setFocused(false)}
            className={'bg-white border-b border-b-light-gray p-3 hover:bg-gray-50 flex items-center justify-start gap-2 last:border-b-0'}
          >
            <SneakerImage
              src={result.previewImageUrl}
              alt={result.title}
              width={20}
              height={20}
            />
            <span className={'text-sm'}>{result.title}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
