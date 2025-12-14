import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Briefcase, 
  Heart, 
  TrendingUp, 
  Star, 
  Eye, 
  Calendar,
  ArrowRight
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { JobActionMenu } from "./JobActionMenu";

export interface JobCardProps {
  job: {
    id: string;
    job_slug?: string;
    title: string;
    description: string;
    images?: string[];
    required_skill?: { name: string };
    status?: string;
    priority?: string;
    is_featured?: boolean;
    is_urgent?: boolean;
    distance_km?: number;
    created_by?: { full_name?: string; avatar_url?: string; slug?: string };
    budget_min?: number;
    budget_max?: number;
    currency?: string;
    location?: string;
    days_remaining?: number;
    application_count?: number;
    view_count?: number;
    created_at?: string | Date;
  };
  isFavorite?: boolean;
  onToggleFavorite?: (e: React.MouseEvent) => void;
  nearbyEnabled?: boolean;
  isOwner?: boolean;
}

export function JobCard({ job, isFavorite, onToggleFavorite, nearbyEnabled, isOwner }: JobCardProps) {
  const formatCurrency = (value?: number) => {
    return value?.toLocaleString("vi-VN") || "0";
  };

  const formatDate = (date?: string | Date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("vi-VN");
  };

  return (
    <Link href={`/jobs/${job.job_slug || job.id}`} className="block h-full">
      <div className="group relative h-full bg-card text-card-foreground border border-border rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
        {/* Image Section */}
        <div className="relative h-52 overflow-hidden">
          <Image
            src={job.images?.[0] || "/placeholder.svg"}
            alt={job.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            {job.is_urgent && (
              <Badge variant="destructive" className="shadow-lg animate-pulse">
                Gấp
              </Badge>
            )}
            {job.priority === "HIGH" && (
              <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-0 shadow-lg">
                Ưu tiên cao
              </Badge>
            )}
          </div>

          {job.is_featured && !isOwner && (
            <div className="absolute top-3 right-3">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                Nổi bật
              </div>
            </div>
          )}

          {isOwner && (
            <div className="absolute top-3 right-3 z-10">
              <JobActionMenu 
                job={{
                  id: job.id,
                  title: job.title,
                  status: job.status,
                  job_slug: job.job_slug
                }} 
                triggerVariant="secondary"
                className="bg-white/90 hover:bg-white text-black shadow-sm"
              />
            </div>
          )}

          {job.is_featured && isOwner && (
            <div className="absolute top-3 right-14">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Category Badge on Image */}
          <div className="absolute bottom-3 left-3">
            <Badge variant="secondary" className="bg-black/40 hover:bg-black/60 text-white backdrop-blur-md border-0">
              {job.required_skill?.name || "Thủ công"}
            </Badge>
          </div>

          {/* Favorite Button (Hide if Owner) */}
          {!isOwner && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute bottom-3 right-3 rounded-full bg-black/20 hover:bg-white/20 text-white backdrop-blur-md border border-white/10"
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorite?.(e);
              }}
            >
              <Heart className={cn("w-5 h-5 transition-colors", isFavorite ? "fill-red-500 text-red-500" : "text-white")} />
            </Button>
          )}
        </div>

        {/* Content Section */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div>
            <h3 className="text-xl font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors mb-2">
              {job.title}
            </h3>
            
            {/* Distance Badge if available */}
            {typeof job.distance_km === "number" && nearbyEnabled && (
              <div className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full mb-3">
                <MapPin className="w-3.5 h-3.5" />
                {job.distance_km < 1
                  ? `${(job.distance_km * 1000).toFixed(0)}m`
                  : `${job.distance_km.toFixed(1)}km`}{" "}
                từ bạn
              </div>
            )}

            <p className="text-muted-foreground text-sm line-clamp-2">
              {job.description}
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3 py-3 border-y border-border">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <DollarSign className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ngân sách</span>
                <span className="text-sm font-semibold">
                  {formatCurrency(job.budget_min)} - {formatCurrency(job.budget_max)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
                <Clock className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Thời hạn</span>
                <span className="text-sm font-semibold">
                  {job.days_remaining ? `${job.days_remaining} ngày` : "Vô hạn"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500">
                <MapPin className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Địa điểm</span>
                <span className="text-sm font-semibold truncate max-w-[100px]" title={job.location}>
                  {job.location || "Toàn quốc"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
                <Briefcase className="w-4 h-4" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Ứng tuyển</span>
                <span className="text-sm font-semibold">
                  {job.application_count || 0} người
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-auto flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <Link 
                href={job.created_by?.slug ? `/profile/${job.created_by.slug}` : "#"}
                onClick={(e) => e.stopPropagation()}
                className="relative w-8 h-8 hover:opacity-80 transition-opacity"
              >
                {job.created_by?.avatar_url ? (
                  <Image 
                    src={job.created_by.avatar_url} 
                    alt={job.created_by.full_name || "User"} 
                    fill 
                    className="rounded-full object-cover border border-border"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-xs text-white font-bold border border-border">
                    {job.created_by?.full_name?.charAt(0) || "U"}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-white text-[8px] px-1 rounded-full flex items-center border border-background">
                  <Star className="w-2 h-2 fill-current" />
                  4.9
                </div>
              </Link>
              <div className="flex flex-col">
                <Link 
                  href={job.created_by?.slug ? `/profile/${job.created_by.slug}` : "#"}
                  onClick={(e) => e.stopPropagation()}
                  className="text-xs font-medium text-foreground truncate max-w-[80px] hover:text-primary hover:underline transition-all"
                >
                  {job.created_by?.full_name || "Ẩn danh"}
                </Link>
                <span className="text-[10px] text-muted-foreground">
                  {formatDate(job.created_at)}
                </span>
              </div>
            </div>

            <Button size="sm" className="rounded-full px-4 bg-muted hover:bg-primary hover:text-white text-foreground border border-border hover:border-primary transition-all group/btn">
              Chi tiết
              <ArrowRight className="w-3 h-3 ml-2 group-hover/btn:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
