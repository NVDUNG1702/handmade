import Link from "next/link"
import { Facebook, Instagram, Youtube, Mail } from "lucide-react"

export function Footer() {
  const footerLinks = {
    "Về chúng tôi": [
      { label: "Giới thiệu", href: "/about" },
      { label: "Đội ngũ", href: "/team" },
      { label: "Liên hệ", href: "/contact" },
      { label: "Tuyển dụng", href: "/careers" },
    ],
    "Dịch vụ": [
      { label: "Tìm công việc", href: "/job-requests" },
      { label: "Đăng tin", href: "/job-requests/create" },
      { label: "Blog", href: "/blogs" },
      { label: "Cộng đồng", href: "/dashboard" },
    ],
    "Hỗ trợ": [
      { label: "Trung tâm trợ giúp", href: "/help" },
      { label: "Điều khoản", href: "/terms" },
      { label: "Chính sách", href: "/privacy" },
      { label: "FAQ", href: "/faq" },
    ],
  }

  return (
    <footer className="relative glass border-t border-border/50 mt-20 overflow-hidden">
      {/* Decorative stitching at top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="absolute top-2 left-0 right-0 flex justify-center gap-8">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-primary/10" style={{ opacity: 0.3 + (i % 3) * 0.2 }} />
        ))}
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/10 rounded-tl-2xl" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/10 rounded-tr-2xl" />
      {/* </CHANGE> */}

      <div className="max-w-7xl mx-auto px-4 py-12 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-10 h-10 rounded-xl gradient-bg-primary flex items-center justify-center">
                <span className="text-xl font-bold text-primary-foreground">H</span>
                {/* Decorative corner accent */}
                <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-accent/30 rounded-tr-lg" />
              </div>
              <span className="text-xl font-bold gradient-text">Handmade</span>
            </div>
            {/* </CHANGE> */}
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              Nền tảng kết nối nghệ nhân và khách hàng, xây dựng cộng đồng thủ công Việt Nam
            </p>
            <div className="flex gap-2">
              <a
                href="#"
                className="relative w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-accent/10 transition-all duration-300 group"
              >
                <Facebook className="w-4 h-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 transition-colors" />
              </a>
              <a
                href="#"
                className="relative w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-accent/10 transition-all duration-300 group"
              >
                <Instagram className="w-4 h-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 transition-colors" />
              </a>
              <a
                href="#"
                className="relative w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-accent/10 transition-all duration-300 group"
              >
                <Youtube className="w-4 h-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 transition-colors" />
              </a>
              <a
                href="#"
                className="relative w-9 h-9 rounded-lg glass flex items-center justify-center hover:bg-accent/10 transition-all duration-300 group"
              >
                <Mail className="w-4 h-4 transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 rounded-lg border border-primary/0 group-hover:border-primary/20 transition-colors" />
              </a>
            </div>
            {/* </CHANGE> */}
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <div className="relative inline-block mb-4">
                <h3 className="font-semibold">{title}</h3>
                <div className="absolute -bottom-1 left-0 w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent rounded-full" />
              </div>
              {/* </CHANGE> */}
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors inline-block hover:translate-x-0.5 duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="relative pt-8 border-t border-border/50">
          {/* Decorative center accent */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary/20" />
            <div className="w-3 h-3 rounded-full bg-primary/30" />
            <div className="w-2 h-2 rounded-full bg-primary/20" />
          </div>

          <p className="text-center text-sm text-muted-foreground">© 2025 Handmade. Tất cả quyền được bảo lưu.</p>
        </div>
        {/* </CHANGE> */}
      </div>
    </footer>
  )
}
