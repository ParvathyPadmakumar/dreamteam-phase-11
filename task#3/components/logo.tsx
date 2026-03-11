import { cn } from "@/lib/utils";
import logo from "@/components/logo.png";

export const Logo = ({ className, ...props }: React.ComponentProps<"img">) => {
  return (
    <img
      alt="logo"
      className={cn("size-30", className)}
      src={logo.src}
      {...props}
    />
  );
};
