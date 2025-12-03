"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar as CalendarIcon } from "lucide-react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

export default function WorkerSchedulePage() {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Link href="/dashboard/worker">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Lịch làm việc</h1>
            <p className="text-muted-foreground">
              Quản lý thời gian và công việc sắp tới
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="p-6 bg-card border-border shadow-sm col-span-1">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </Card>

          <Card className="p-6 bg-card border-border shadow-sm col-span-2">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-primary" />
              Công việc ngày {date?.toLocaleDateString("vi-VN")}
            </h2>
            
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <div>
                <p className="font-medium text-foreground">Không có công việc nào</p>
                <p className="text-sm text-muted-foreground">
                  Bạn chưa có lịch làm việc cho ngày này.
                </p>
              </div>
              <Link href="/jobs">
                <Button variant="outline">Tìm công việc mới</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
