"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Search, Send, Paperclip, MoreVertical } from "lucide-react"

export default function StoreMessagesPage() {
  const [selectedChat, setSelectedChat] = useState(1)
  const [message, setMessage] = useState("")

  const conversations = [
    {
      id: 1,
      name: "Nguyễn Văn A",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Sản phẩm còn hàng không ạ?",
      time: "10:30",
      unread: 2,
      online: true,
    },
    {
      id: 2,
      name: "Trần Thị B",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Cảm ơn shop nhé!",
      time: "09:15",
      unread: 0,
      online: false,
    },
    {
      id: 3,
      name: "Lê Văn C",
      avatar: "/placeholder.svg?height=40&width=40",
      lastMessage: "Khi nào giao hàng vậy shop?",
      time: "Hôm qua",
      unread: 1,
      online: true,
    },
  ]

  const messages = [
    {
      id: 1,
      sender: "customer",
      content: "Chào shop, sản phẩm túi da còn hàng không ạ?",
      time: "10:25",
    },
    {
      id: 2,
      sender: "store",
      content: "Chào bạn! Sản phẩm vẫn còn hàng nhé. Bạn muốn đặt màu nào?",
      time: "10:27",
    },
    {
      id: 3,
      sender: "customer",
      content: "Màu nâu có không shop?",
      time: "10:28",
    },
    {
      id: 4,
      sender: "store",
      content: "Có ạ, shop còn 3 cái màu nâu. Bạn đặt ngay nhé!",
      time: "10:30",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-2">
          Tin nhắn cửa hàng
        </h1>
        <p className="text-muted-foreground">Trò chuyện với khách hàng của bạn</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-card border-white/20 lg:col-span-1">
          <CardContent className="p-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Tìm kiếm..." className="pl-10" />
            </div>

            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setSelectedChat(conv.id)}
                  className={`w-full p-3 rounded-xl transition-all text-left ${
                    selectedChat === conv.id
                      ? "bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30"
                      : "hover:bg-accent/10"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage src={conv.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{conv.name[0]}</AvatarFallback>
                      </Avatar>
                      {conv.online && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium truncate">{conv.name}</p>
                        <span className="text-xs text-muted-foreground">{conv.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    </div>
                    {conv.unread > 0 && (
                      <Badge className="bg-gradient-to-r from-primary to-accent text-white border-0">
                        {conv.unread}
                      </Badge>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card border-white/20 lg:col-span-2">
          <CardContent className="p-0 flex flex-col h-[600px]">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback>N</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">Nguyễn Văn A</p>
                  <p className="text-xs text-green-500">Đang hoạt động</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "store" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                      msg.sender === "store" ? "bg-gradient-to-r from-primary to-accent text-white" : "bg-accent/10"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === "store" ? "text-white/70" : "text-muted-foreground"}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1"
                />
                <Button className="bg-gradient-to-r from-primary to-accent">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
