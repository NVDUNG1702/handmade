import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast"; // Replaced antd toast
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { updateJobRequest } from "@/lib/api-job-requests";

interface JobStatusDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobId: string;
  currentStatus: string;
  onSuccess?: () => void;
}

const JOB_STATUSES = [
  { value: "OPEN", label: "Đang tìm thợ (Open)" },
  { value: "IN_PROGRESS", label: "Đang thực hiện (In Progress)" },
  { value: "COMPLETED", label: "Hoàn thành (Completed)" },
  { value: "CANCELLED", label: "Đã hủy (Cancelled)" },
  // EXPIRED and ASSIGNED are usually system states, but admin/owner might force them logic permits
];

export function JobStatusDialog({
  open,
  onOpenChange,
  jobId,
  currentStatus,
  onSuccess,
}: JobStatusDialogProps) {
  const [status, setStatus] = useState<string>(currentStatus);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (newStatus: string) =>
      updateJobRequest(jobId, { status: newStatus as any }),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Cập nhật trạng thái thành công",
      });
      queryClient.invalidateQueries({ queryKey: ["job-requests"] });
      queryClient.invalidateQueries({ queryKey: ["job-request", jobId] });
      onSuccess?.();
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error.response?.data?.message || "Có lỗi xảy ra",
      });
    },
  });

  const handleUpdate = () => {
    if (status === currentStatus) {
      onOpenChange(false);
      return;
    }
    mutation.mutate(status);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật trạng thái</DialogTitle>
          <DialogDescription>
            Thay đổi trạng thái hiện tại của công việc.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Trạng thái
            </Label>
            <div className="col-span-3">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Chọn trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={mutation.isPending}
          >
            Hủy
          </Button>
          <Button type="submit" onClick={handleUpdate} disabled={mutation.isPending}>
            {mutation.isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
