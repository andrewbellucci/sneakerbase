import {Link} from "@remix-run/react";


interface FeatureHeaderProps {
  id: string;
  previewImageUrl: string;
  title: string;
  colorWay: string;
  make: string;
  slug: string;
  derivedColor: string | null;
  derivedSecondaryColor: string | null;
}

export default function FeatureHeader({ previewImageUrl, derivedSecondaryColor, derivedColor, colorWay, make, slug, title, id }: FeatureHeaderProps) {
  const today = new Date();
  const month = today.toLocaleString('default', { month: 'long' });
  const day = today.getDate();

  return (
    <Link className={"text-white block mb-[50px] transition-transform duration-[0.5s] hover:translate-y-[-5px]"} to={`/sneaker/${slug}`}>
      <div
        className={
          `flex lg:flex-row flex-col rounded-[22px] overflow-hidden shadow-2xl relative`
        }
        style={{
          backgroundColor: derivedColor ? derivedColor : '#fff',
          boxShadow: `0px 10px 20px 5px ${derivedColor ? derivedColor : '#fff'}15`
        }}
      >
        <div
          className="lg:flex-1 relative border-b-2 border-off-white bg-white lg:border-b-0 lg:border-r-2 h-[200px] lg:h-auto z-[2]"
        >
          <img
            src={previewImageUrl}
            alt={title}
            className={"p-10 object-contain object-center"}
          />
        </div>
        <div
          className="flex-1 flex flex-col border-t-2 lg:border-t-0 lg:border-l-2 border-off-white relative z-[2]"
        >
          <div className={"flex-1 border-b-4 border-b-off-white p-10"}>
            <h3 className={"font-black text-[50px] leading-[63px]"}>
              {title}
            </h3>
          </div>
          <div className={"flex"}>
            <div
              className={
                "flex-1 border-r-4 border-r-off-white p-10 flex items-center justify-start"
              }
            >
              <p className={"font-semibold text-md"}>
                &apos;{colorWay}&apos;<br />
                {make}
              </p>
            </div>
            <div
              className={
                "flex items-center justify-center flex-col aspect-square p-5"
              }
            >
              <span className={"font-black text-[50px] leading-[63px]"}>{day}</span>
              <span className={"font-semibold uppercase text-2xl"}>
                {month}
              </span>
            </div>
          </div>
        </div>
        <div
          className={
            "absolute z-[1] w-full h-full bg-gradient-to-tr from-white/0 via-white/20 to-white/0"
          }
        />
      </div>
    </Link>
  );
}
