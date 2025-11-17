"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Eye, Package, Truck, CheckCircle, XCircle } from "lucide-react"

export default function StoreOrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const orders = [
    {
      id: "DH001",
      customer: "Nguyễn Văn A",
      products: 2,
      total: 1200000,
      status: "pending",
      date: "2024-01-15",
    },
    {
      id: "DH002",
      customer: "Trần Thị B",
      products: 1,
      total: 850000,
      status: "shipping",
      date: "2024-01-14",
    },
    {
      id: "DH003",
      customer: "Lê Văn C",
      products: 3,
      total: 2100000,
      status: "completed",
      date: "2024-01-13",
    },
    {
      id: "DH004",
      customer: "Phạm Thị D",
      products: 1,
      total: 450000,
      status: "cancelled",
      date: "2024-01-12",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 gap-1">
            <Package className="w-3 h-3" />
            Chờ xử lý
          </Badge>
        )
      case "shipping":
        return (
          <Badge className="bg-blue-500/20 text-blue-500 border-blue-500/30 gap-1">
            <Truck className="w-3 h-3" />
            Đang giao
          </Badge>
        )
      case "completed":
        return (
          <Badge className="bg-green-500/20 text-green-500 border-green-500/30 gap-1">
            <CheckCircle className="w-3 h-3" />
            Hoàn thành
          </Badge>
        )
      case "cancelled":
        return (
          <Badge className="bg-red-500/20 text-red-500 border-red-500/30 gap-1">
            <XCircle className="w-3 h-3" />
            Đã hủy
          </Badge>
        )
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Quản lý đơn hàng
        </h1>
        <p className="text-muted-foreground">Theo dõi và xử lý đơn hàng của cửa hàng</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Chờ xử lý</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                <Package className="w-6 h-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đang giao</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Hoàn thành</p>
                <p className="text-2xl font-bold">156</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Đã hủy</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm đơn hàng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="shipping">Đang giao</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã đơn</TableHead>
                <TableHead>Khách hàng</TableHead>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Ngày đặt</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>{order.products} sản phẩm</TableCell>
                  <TableCell>{order.total.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>{new Date(order.date).toLocaleDateString("vi-VN")}</TableCell>
                  <TableCell>{getStatusBadge(order.status)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
