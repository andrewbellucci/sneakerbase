import LogoText from "~/components/branding/LogoText";
import SocialButton from "../components/SocialButton";
import InstagramIcon from "~/components/icons/InstagramIcon";
import TwitterIcon from "~/components/icons/TwitterIcon";
import {Link} from "@remix-run/react";

export default function Footer() {
  return (
    <footer className={"bg-light-gray py-20"}>
      <div
        className={
          "container flex justify-between items-start gap-[50px] flex-col md:flex-row"
        }
      >
        <div className={"flex-1 min-w-[300px]"}>
          <LogoText />
          <p className={"text-default-black font-medium text-sm my-5"}>
            SneakerBase delivers lorem ipsum dolor sit amet, consectetur
            adipiscing elit sed do eiusmod.
          </p>
          <div className={"flex items-center justify-start gap-2.5"}>
            <SocialButton
              href={"https://twitter.com/sneakerbaseco"}
              icon={<TwitterIcon />}
            />
            <SocialButton
              href={"https://twitter.com/sneakerbaseco"}
              icon={<InstagramIcon />}
            />
          </div>
        </div>
        <div className="flex-1">
          <h3 className={"font-bold text-md text-default-black mb-2"}>
            Browse
          </h3>
          <ul>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Nike
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Adidas
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Jordan
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Yeezy
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className={"font-bold text-md text-default-black mb-2"}>API</h3>
          <ul>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                About
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Plans
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Documentation
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className={"font-bold text-md text-default-black mb-2"}>
            Company
          </h3>
          <ul>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Contact
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Careers
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Bellu Development
              </Link>
            </li>
          </ul>
        </div>
        <div className="flex-1">
          <h3 className={"font-bold text-md text-default-black mb-2"}>Legal</h3>
          <ul>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Terms of Service
              </Link>
            </li>
            <li className={"mb-2 last:mb-0"}>
              <Link
                className={"text-primary/60 text-sm font-medium"}
                to={"/"}
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div
        className={
          "mt-[50px] pt-[50px] flex items-center justify-between container border-t border-t-default-black/5 text-primary/60 text-sm font-medium flex-col md:flex-row"
        }
      >
        <span>
          Copyright &copy; {new Date().getFullYear()} Sneakerbase. All Rights
          Reserved.
        </span>
        <span>
          <span className={"text-default-black text-sm"}>32.29TB</span> of info
          served
        </span>
      </div>
    </footer>
  );
}
