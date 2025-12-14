"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MoreHorizontal,
  Pencil,
  Trash2,
  RefreshCw,
  MoreVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JobStatusDialog } from "./JobStatusDialog";
import { DeleteJobDialog } from "./DeleteJobDialog";

interface JobActionMenuProps {
  job: {
    id: string;
    title: string;
    status?: string;
    job_slug?: string;
  };
  triggerVariant?: "ghost" | "outline" | "secondary" | "default";
  triggerSize?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

export function JobActionMenu({
  job,
  triggerVariant = "ghost",
  triggerSize = "icon",
  className,
}: JobActionMenuProps) {
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={triggerVariant}
            size={triggerSize}
            className={className}
            onClick={(e) => e.stopPropagation()}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="sr-only">Thao tác</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem asChild>
            <Link href={`/jobs/edit/${job.id}`} className="cursor-pointer">
              <Pencil className="w-4 h-4 mr-2" />
              Chỉnh sửa
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowStatusDialog(true)}
            className="cursor-pointer"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Cập nhật trạng thái
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Xóa công việc
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <JobStatusDialog
        open={showStatusDialog}
        onOpenChange={setShowStatusDialog}
        jobId={job.id}
        currentStatus={job.status || "OPEN"}
      />

      <DeleteJobDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        jobId={job.id}
      />
    </>
  );
}
