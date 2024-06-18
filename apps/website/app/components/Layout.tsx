import Navigation from "../components/Navigation";
import { PropsWithChildren } from "react";
import Footer from "../components/Footer";

interface LayoutProps {
  noContainer?: boolean;
}

export default function Layout({
  children,
  noContainer
}: PropsWithChildren<LayoutProps>) {
  return (
    <>
      <Navigation />
      <main className={!noContainer ? "py-20" : undefined}>
        <div className={!noContainer ? "container" : undefined}>{children}</div>
      </main>
      <Footer />
    </>
  );
}
