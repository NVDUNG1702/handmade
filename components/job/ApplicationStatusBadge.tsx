import { Badge } from "@/components/ui/badge";
import { Clock, Star, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

type ApplicationStatus =
  | "PENDING"
  | "SHORTLISTED"
  | "SELECTED"
  | "REJECTED"
  | "WITHDRAWN";

interface ApplicationStatusBadgeProps {
  status: ApplicationStatus;
  className?: string;
}

const statusConfig = {
  PENDING: {
    label: "Chờ xử lý",
    variant: "default" as const,
    className:
      "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20",
    icon: Clock,
  },
  SHORTLISTED: {
    label: "Danh sách ngắn",
    variant: "default" as const,
    className:
      "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20",
    icon: Star,
  },
  SELECTED: {
    label: "Đã chọn",
    variant: "default" as const,
    className:
      "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Đã từ chối",
    variant: "destructive" as const,
    className: "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20",
    icon: XCircle,
  },
  WITHDRAWN: {
    label: "Đã rút",
    variant: "secondary" as const,
    className:
      "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20",
    icon: AlertCircle,
  },
};

export function ApplicationStatusBadge({
  status,
  className,
}: ApplicationStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`${config.className} ${className || ""}`}
    >
      <Icon className="w-3 h-3 mr-1" />
      {config.label}
    </Badge>
  );
}

export default ApplicationStatusBadge;
