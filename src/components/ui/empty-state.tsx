import { cn } from "@/lib/utils";

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-night-200 bg-white/60 px-6 py-14 text-center",
        className
      )}
    >
      {icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-night-50 text-night-400">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-night-800">{title}</h3>
      {description && (
        <p className="mt-1.5 max-w-sm text-sm text-night-500">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
