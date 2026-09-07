import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { STATUS_LABELS, type ProjectStatus } from "@/lib/progression";

const STATUS_CLASSNAMES: Record<ProjectStatus, string> = {
  a_venir: "bg-secondary text-secondary-foreground",
  en_cours: "bg-primary text-primary-foreground",
  a_valider: "bg-warning/15 text-warning",
  valide: "bg-success/15 text-success",
};

export function StatusBadge({
  status,
  className,
}: {
  status: ProjectStatus;
  className?: string;
}) {
  return (
    <Badge variant="secondary" className={cn(STATUS_CLASSNAMES[status], className)}>
      {STATUS_LABELS[status]}
    </Badge>
  );
}
