"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function WorkerEarningsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/worker">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Thu nhập</h1>
              <p className="text-muted-foreground">
                Theo dõi doanh thu và lịch sử thanh toán
              </p>
            </div>
          </div>
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Xuất báo cáo
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-green-500/10 text-green-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tổng thu nhập</p>
                <h3 className="text-2xl font-bold text-foreground">0 VNĐ</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-500">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Tháng này</p>
                <h3 className="text-2xl font-bold text-foreground">0 VNĐ</h3>
              </div>
            </div>
          </Card>
          <Card className="p-6 bg-card border-border shadow-sm">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-orange-500/10 text-orange-500">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đang chờ thanh toán</p>
                <h3 className="text-2xl font-bold text-foreground">0 VNĐ</h3>
              </div>
            </div>
          </Card>
        </div>

        {/* Chart Placeholder */}
        <Card className="p-6 bg-card border-border shadow-sm h-64 flex items-center justify-center">
          <p className="text-muted-foreground">Biểu đồ thu nhập sẽ hiển thị ở đây</p>
        </Card>

        {/* Transactions */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">Lịch sử giao dịch</h2>
            <div className="w-48">
              <Select defaultValue="all">
                <SelectTrigger>
                  <SelectValue placeholder="Lọc theo thời gian" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả</SelectItem>
                  <SelectItem value="month">Tháng này</SelectItem>
                  <SelectItem value="year">Năm nay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Card className="p-8 bg-card border-border shadow-sm text-center">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Chưa có giao dịch nào
            </h3>
            <p className="text-muted-foreground">
              Các khoản thanh toán từ công việc sẽ xuất hiện tại đây.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}
