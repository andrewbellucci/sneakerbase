import LogoIcon from "~/components/branding/LogoIcon";
import SearchBar from "../components/SearchBar";
import Button from "~/components/Button";
import { useEffect, useState } from "react";
import clsx from "clsx";
import MenuIcon from "~/components/icons/MenuIcon";
import SearchIcon from "~/components/icons/SearchIcon";
import Dialog from "./Dialog";
import {Link} from "@remix-run/react";

export default function Navigation() {
  const [signingUp, setSigningUp] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  // const { isSignedIn, isLoaded } = useUser();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className={'bg-yellow-200 border-b border-b-light-gray font-bold py-2 top-0 z-50 text-center relative z-[10]'}>
        🚧 Sneakerbase is under construction. We&apos;ll be up soon! 🚧
      </div>
      <nav
        className={clsx(
          "bg-white border-b border-b-light-gray sticky top-0 z-50 transition-all duration-300 backdrop-blur",
          scrolled ? "bg-white/80" : "bg-white"
        )}
      >
        <div
          className={"container flex items-center justify-between h-[60px] gap-5"}
        >
          <Link to={"/"}>
            <LogoIcon />
          </Link>
          <div className={"flex-1 md:flex hidden justify-center relative"}>
            <SearchBar />
          </div>
          <div className={"items-center justify-end hidden md:flex"}>
            <Dialog
              open={signingIn}
              onOpenChange={setSigningIn}
              trigger={<Button onClick={() => setSigningIn(true)} variant={"ghost"}>Sign In</Button>}
            >
              {/*<SignIn />*/}
            </Dialog>
            <Dialog
              open={signingUp}
              onOpenChange={setSigningUp}
              trigger={<Button onClick={() => setSigningUp(true)}>Sign Up</Button>}
            >
              {/*<SignUp />*/}
            </Dialog>
          </div>
          <div className={"flex items-center justify-end md:hidden gap-5"}>
            <button className={"inline-flex h-10 items-center justify-center"}>
              <SearchIcon height={"16px"} width={"16px"} color={"#26292B"} />
            </button>
            <button className={"inline-flex h-10 items-center justify-center"}>
              <MenuIcon />
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
