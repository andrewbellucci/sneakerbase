interface SocialButtonProps {
  href: string;
  icon: JSX.Element;
}
export default function SocialButton({ href, icon }: SocialButtonProps) {
  return (
    <a
      className={
        "w-[30px] h-[30px] rounded-[11px] bg-tertiary inline-flex items-center justify-center hover:opacity/50 transition-opacity"
      }
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {icon}
    </a>
  );
}
