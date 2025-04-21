
import { cn } from "@/lib/utils";

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
  };
  gap?: number;
  children: React.ReactNode;
}

export function Grid({ 
  children, 
  columns = { sm: 1, md: 2, lg: 3 }, 
  gap = 4, 
  className, 
  ...props 
}: GridProps) {
  // Generate responsive grid template columns
  const gridClasses = cn(
    "grid",
    gap && `gap-${gap}`,
    columns?.sm && `sm:grid-cols-${columns.sm}`,
    columns?.md && `md:grid-cols-${columns.md}`,
    columns?.lg && `lg:grid-cols-${columns.lg}`,
    className
  );

  return (
    <div className={gridClasses} {...props}>
      {children}
    </div>
  );
}
