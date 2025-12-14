"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Pencil, Loader2 } from "lucide-react";
import { useUpdateUserSkill } from "@/hooks/use-skills";
import type { UserSkill } from "@/lib/types";

const formSchema = z.object({
  proficiency_level: z
    .number()
    .min(1, "Mức độ tối thiểu là 1")
    .max(10, "Mức độ tối đa là 10")
    .optional(),
  years_of_experience: z
    .number()
    .min(0, "Số năm kinh nghiệm không được âm")
    .optional(),
  experience_description: z
    .string()
    .max(500, "Mô tả không được quá 500 ký tự")
    .optional(),
  is_public: z.boolean().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface EditSkillDialogProps {
  skill: UserSkill;
}

export function EditSkillDialog({ skill }: EditSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const updateSkill = useUpdateUserSkill();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proficiency_level: skill.level as number | undefined,
      years_of_experience: skill.years_of_experience || skill.experience_years,
      experience_description: skill.description || "",
      is_public: skill.is_public ?? true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await updateSkill.mutateAsync({
        id: skill.id || skill._id!,
        data: values,
      });
      setOpen(false);
    } catch (error) {
      // Error already handled by mutation hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Pencil className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Chỉnh sửa kỹ năng: {skill.skillName}</DialogTitle>
          <DialogDescription>
            Cập nhật thông tin kỹ năng của bạn
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Proficiency Level */}
            <FormField
              control={form.control}
              name="proficiency_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mức độ thành thạo (1-10)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={10}
                      placeholder="Ví dụ: 8"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    1 = Mới bắt đầu, 10 = Chuyên gia
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Years of Experience */}
            <FormField
              control={form.control}
              name="years_of_experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số năm kinh nghiệm</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      placeholder="Ví dụ: 3"
                      {...field}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? parseInt(e.target.value) : undefined
                        )
                      }
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience Description */}
            <FormField
              control={form.control}
              name="experience_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả kinh nghiệm</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Mô tả ngắn gọn về kinh nghiệm của bạn với kỹ năng này..."
                      className="resize-none"
                      rows={3}
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {field.value?.length || 0}/500 ký tự
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Public/Private */}
            <FormField
              control={form.control}
              name="is_public"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                  <div className="space-y-0.5">
                    <FormLabel>Hiển thị công khai</FormLabel>
                    <FormDescription>
                      Cho phép mọi người xem kỹ năng này trên hồ sơ của bạn
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={updateSkill.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={updateSkill.isPending}>
                {updateSkill.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Cập nhật
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
