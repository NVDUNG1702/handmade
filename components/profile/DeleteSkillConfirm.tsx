"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useDeleteUserSkill } from "@/hooks/use-skills";

interface DeleteSkillConfirmProps {
  skillId: string;
  skillName: string;
}

export function DeleteSkillConfirm({ skillId, skillName }: DeleteSkillConfirmProps) {
  const [open, setOpen] = useState(false);
  const deleteSkill = useDeleteUserSkill();

  const handleDelete = async () => {
    try {
      await deleteSkill.mutateAsync(skillId);
      setOpen(false);
    } catch (error) {
      // Error already handled by mutation hook
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Trash2 className="h-3 w-3 text-destructive" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa kỹ năng</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc muốn xóa kỹ năng <strong>"{skillName}"</strong>?
            <br />
            Bạn có thể thêm lại sau nếu cần.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteSkill.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={deleteSkill.isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {deleteSkill.isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
