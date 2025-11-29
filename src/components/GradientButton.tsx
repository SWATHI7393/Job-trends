import { cn } from "@/lib/utils";
import { Button, type ButtonProps } from "./ui/button";

interface GradientButtonProps extends ButtonProps {
  children: React.ReactNode;
}

export default function GradientButton({ children, className, ...props }: GradientButtonProps) {
  return (
    <Button
      className={cn("btn-gradient font-semibold shadow-lg hover:shadow-xl transition-shadow duration-300", className)}
      {...props}
    >
      {children}
    </Button>
  );
}
