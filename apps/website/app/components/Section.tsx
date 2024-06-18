import { PropsWithChildren } from "react";
import SectionHeading from "../components/SectionHeading";

interface SectionProps extends PropsWithChildren {
  title?: string;
  HeadingComponent?: JSX.Element;
}

export default function Section({
  title,
  children,
  HeadingComponent,
}: SectionProps) {
  return (
    <div className={"mb-[50px] last:mb-0"}>
      <div className={"flex justify-between"}>
        {title && <SectionHeading>{title}</SectionHeading>}
        {HeadingComponent && HeadingComponent}
      </div>
      {children}
    </div>
  );
}
