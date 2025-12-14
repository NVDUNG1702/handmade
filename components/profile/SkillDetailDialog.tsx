"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Briefcase, Award } from "lucide-react";
import type { UserSkill } from "@/lib/types";

interface SkillDetailDialogProps {
  skill: UserSkill;
  userId: string;
  isOwner?: boolean;
  children: React.ReactNode;
}

export function SkillDetailDialog({
  skill,
  userId,
  isOwner = false,
  children,
}: SkillDetailDialogProps) {
  const [open, setOpen] = useState(false);

  // Calculate star rating visual
  const proficiency = skill.level || skill.proficiency_level || 0;
  const maxStars = 10;
  const filledStars = typeof proficiency === 'number' ? proficiency : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Award className="w-6 h-6 text-primary" />
                {skill.skillName}
              </DialogTitle>
              <DialogDescription className="mt-1">
                Thông tin chi tiết về kỹ năng
              </DialogDescription>
            </div>
            {skill.is_public ? (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                Công khai
              </Badge>
            ) : (
              <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                Riêng tư
              </Badge>
            )}
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Stats Card */}
          <Card className="p-4 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <div className="grid grid-cols-2 gap-4">
              {/* Proficiency Level */}
              {proficiency > 0 && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star className="w-4 h-4" />
                    <span>Mức độ thành thạo</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: maxStars }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < filledStars
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-sm font-semibold">
                      {filledStars}/{maxStars}
                    </span>
                  </div>
                </div>
              )}

              {/* Years of Experience */}
              {(skill.years_of_experience || skill.experience_years) && (
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Kinh nghiệm</span>
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {skill.years_of_experience || skill.experience_years} năm
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Description */}
          {(skill.description || skill.experience_description) && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Mô tả kinh nghiệm
              </h3>
              <p className="text-sm leading-relaxed whitespace-pre-line">
                {skill.description || skill.experience_description}
              </p>
            </div>
          )}

          {/* Portfolio - Placeholder for Phase 2 */}
          {skill.portfolio_images && skill.portfolio_images.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                Portfolio
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {skill.portfolio_images.slice(0, 6).map((img, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
                  >
                    <img
                      src={img}
                      alt={`${skill.skillName} portfolio ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder for Completed Jobs - Phase 3 */}
          <div className="text-sm text-muted-foreground text-center py-4 border-t">
            Completed jobs và reviews sẽ được hiển thị ở đây (Phase 3)
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Đóng
            </Button>
            {!isOwner && (
              <Button>
                <Briefcase className="w-4 h-4 mr-2" />
                Liên hệ thuê
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
