"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"

export default function StoreProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const products = [
    {
      id: 1,
      name: "Túi da handmade cao cấp",
      image: "/leather-bag-crafting.jpg",
      price: 850000,
      stock: 15,
      sold: 45,
      status: "active",
      category: "Finished",
    },
    {
      id: 2,
      name: "Bộ len đan tay",
      image: "/colorful-yarn-balls-set.jpg",
      price: 120000,
      stock: 0,
      sold: 23,
      status: "out_of_stock",
      category: "Material",
    },
    {
      id: 3,
      name: "Vòng tay handmade",
      image: "/handmade-jewelry-beads.jpg",
      price: 250000,
      stock: 30,
      sold: 67,
      status: "active",
      category: "Finished",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-500 border-green-500/30">Đang bán</Badge>
      case "out_of_stock":
        return <Badge className="bg-red-500/20 text-red-500 border-red-500/30">Hết hàng</Badge>
      default:
        return <Badge>Không xác định</Badge>
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
              Quản lý sản phẩm
            </h1>
            <p className="text-muted-foreground">Quản lý danh sách sản phẩm của cửa hàng</p>
          </div>
          <Link href="/dashboard/store/products/add">
            <Button className="bg-gradient-to-r from-primary to-accent gap-2">
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
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
              <SelectItem value="active">Đang bán</SelectItem>
              <SelectItem value="out_of_stock">Hết hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card className="glass-card border-white/20">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tồn kho</TableHead>
                <TableHead>Đã bán</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <img
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <span className="font-medium">{product.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{product.category === "Finished" ? "Thành phẩm" : "Nguyên liệu"}</Badge>
                  </TableCell>
                  <TableCell>{product.price.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell>{product.stock}</TableCell>
                  <TableCell>{product.sold}</TableCell>
                  <TableCell>{getStatusBadge(product.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/dashboard/store/products/${product.id}`}>
                        <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/dashboard/store/products/${product.id}/edit`}>
                        <Button variant="ghost" size="icon" className="hover:bg-accent/10">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button variant="ghost" size="icon" className="hover:bg-red-500/10 text-red-500">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
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
