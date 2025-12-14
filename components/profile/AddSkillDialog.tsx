"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useSkills, useCreateUserSkill } from "@/hooks/use-skills";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  skillId: z.string().min(1, "Vui lòng chọn kỹ năng"),
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
  is_public: z.boolean().optional().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddSkillDialogProps {
  userId: string;
}

export function AddSkillDialog({ userId }: AddSkillDialogProps) {
  const [open, setOpen] = useState(false);
  const { data: skills, isLoading: skillsLoading } = useSkills();
  const createSkill = useCreateUserSkill();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      skillId: "",
      proficiency_level: undefined,
      years_of_experience: undefined,
      experience_description: "",
      is_public: true,
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await createSkill.mutateAsync({
        userId,
        ...values,
      });
      toast.success("Thêm kỹ năng thành công!");
      setOpen(false);
      form.reset();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        error?.message ||
        "Không thể thêm kỹ năng";
      
      // Handle duplicate skill error
      if (errorMessage.includes("duplicate") || errorMessage.includes("already exists")) {
        toast.error("Kỹ năng đã tồn tại trong hồ sơ của bạn");
      } else {
        toast.error(errorMessage);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          + Thêm
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Thêm kỹ năng mới</DialogTitle>
          <DialogDescription>
            Thêm một kỹ năng vào hồ sơ của bạn để giúp khách hàng tìm thấy bạn dễ dàng hơn.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Skill Selection */}
            <FormField
              control={form.control}
              name="skillId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kỹ năng *</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={skillsLoading}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn kỹ năng" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {skills?.map((skill) => (
                        <SelectItem key={skill._id} value={skill._id}>
                          {skill.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                disabled={createSkill.isPending}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={createSkill.isPending}>
                {createSkill.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Thêm kỹ năng
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
