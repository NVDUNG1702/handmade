"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Check,
  ChevronRight,
  DollarSign,
  ImageIcon,
  Info,
  MapPin,
  Plus,
  Trash,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useCreateJobRequest } from "@/hooks/use-job-requests";
import { useProvinces, useWards } from "@/hooks/use-location";
import { useSkills } from "@/hooks/use-skills";
import { RequireAuth } from "@/components/require-auth";
import Link from "next/link";

interface FormData {
  title: string;
  description: string;
  location: string;
  ward: string;
  city: string;
  district: string;
  provinceCode: string;
  wardCode: string;
  latitude: string;
  longitude: string;
  budget_min: string;
  budget_max: string;
  currency: string;
  deadline: string;
  priority: string;
  required_skill: string;
  images: string[];
}

interface FormErrors {
  [key: string]: string;
}

const STEPS = [
  { id: 1, title: "Thông tin cơ bản" },
  { id: 2, title: "Chi tiết dự án" },
  { id: 3, title: "Kỹ năng & Hình ảnh" },
];

export default function CreateJobPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});

  // Form State
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    ward: "",
    city: "",
    district: "",
    provinceCode: "",
    wardCode: "",
    latitude: "",
    longitude: "",
    budget_min: "",
    budget_max: "",
    currency: "VND",
    deadline: "",
    priority: "NORMAL",
    required_skill: "",
    images: [],
  });

  // API Hooks
  const { data: provincesData, loading: provincesLoading } = useProvinces();
  const { data: wardsData, loading: wardsLoading } = useWards(
    formData.provinceCode || null
  );
  const { data: skillsData, isLoading: skillsLoading } = useSkills();
  const createJobRequestMutation = useCreateJobRequest();

  // Handlers
  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProvinceChange = (code: string) => {
    const province = provincesData?.data?.find((p) => p.code === code);
    if (province) {
      setFormData((prev) => ({
        ...prev,
        provinceCode: code,
        city: province.name,
        location: province.name,
        wardCode: "",
        ward: "",
        district: "",
      }));
    }
  };

  const handleWardChange = (code: string) => {
    const ward = wardsData?.data?.find((w) => w.code === code);
    if (ward) {
      setFormData((prev) => ({
        ...prev,
        wardCode: code,
        ward: ward.name,
        district: ward.name, // Using ward name as district/ward for simplicity if structure varies
      }));
    }
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;

    const urlPattern = /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp)(\?.*)?$/i;
    if (!urlPattern.test(imageUrlInput.trim())) {
      toast({
        variant: "destructive",
        title: "URL không hợp lệ",
        description: "Vui lòng nhập URL ảnh (jpg, png, gif, webp)",
      });
      return;
    }

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, imageUrlInput.trim()],
    }));
    setImageUrlInput("");
  };

  const handleRemoveImageUrl = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Validation
  const validateStep = (step: number): boolean => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Tiêu đề là bắt buộc";
      if (!formData.description.trim())
        newErrors.description = "Mô tả là bắt buộc";
      if (!formData.provinceCode)
        newErrors.provinceCode = "Vui lòng chọn Tỉnh/Thành phố";
    } else if (step === 2) {
      if (!formData.budget_min)
        newErrors.budget_min = "Ngân sách tối thiểu là bắt buộc";
      if (!formData.budget_max)
        newErrors.budget_max = "Ngân sách tối đa là bắt buộc";
      if (
        formData.budget_min &&
        formData.budget_max &&
        Number(formData.budget_min) >= Number(formData.budget_max)
      ) {
        newErrors.budget_max = "Ngân sách tối đa phải lớn hơn tối thiểu";
      }
      if (!formData.deadline) newErrors.deadline = "Hạn chót là bắt buộc";
    } else if (step === 3) {
      if (!formData.required_skill)
        newErrors.required_skill = "Vui lòng chọn kỹ năng yêu cầu";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    } else {
      toast({
        variant: "destructive",
        title: "Thông tin chưa đầy đủ",
        description: "Vui lòng kiểm tra lại các trường bắt buộc",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateStep(3)) return;

    setIsSubmitting(true);
    try {
      await createJobRequestMutation.mutateAsync({
        title: formData.title,
        description: formData.description,
        required_skill: formData.required_skill,
        location: formData.location,
        city: formData.city,
        district: formData.district,
        ward: formData.ward,
        provinceCode: formData.provinceCode,
        wardCode: formData.wardCode,
        budget_min: Number(formData.budget_min),
        budget_max: Number(formData.budget_max),
        currency: formData.currency,
        deadline: formData.deadline,
        priority: formData.priority as any,
        is_urgent: formData.priority === "URGENT",
        images: formData.images,
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
      });

      toast({
        title: "Thành công",
        description: "Đã tạo yêu cầu công việc mới!",
      });
      router.push("/dashboard/customer");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: error?.message || "Không thể tạo yêu cầu công việc",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <RequireAuth>
      <div className="min-h-screen py-12 bg-background">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-8">
            <Button
              variant="ghost"
              className="mb-4 pl-0 hover:bg-transparent hover:text-primary"
              asChild
            >
              <Link href="/dashboard/customer">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại Dashboard
              </Link>
            </Button>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Đăng công việc mới
            </h1>
            <p className="text-muted-foreground mt-2">
              Tìm kiếm thợ thủ công tài năng cho dự án của bạn
            </p>
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center justify-between relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-muted -z-10" />
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 bg-background px-2 ${
                    currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                      currentStep >= step.id
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground bg-background"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <span className="text-sm font-medium hidden sm:block">
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Form Content */}
          <Card className="glass-card border-white/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentStep === 1 && <Briefcase className="w-5 h-5" />}
                {currentStep === 2 && <DollarSign className="w-5 h-5" />}
                {currentStep === 3 && <ImageIcon className="w-5 h-5" />}
                {STEPS[currentStep - 1].title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Basic Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">
                      Tiêu đề công việc <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="title"
                      placeholder="VD: Cần làm túi len handmade theo mẫu"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      className={errors.title ? "border-red-500" : ""}
                    />
                    {errors.title && (
                      <p className="text-xs text-red-500">{errors.title}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Mô tả chi tiết <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Mô tả chi tiết yêu cầu, kích thước, chất liệu..."
                      rows={5}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-xs text-red-500">
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>
                        Tỉnh/Thành phố <span className="text-red-500">*</span>
                      </Label>
                      <Select
                        value={formData.provinceCode}
                        onValueChange={handleProvinceChange}
                      >
                        <SelectTrigger
                          className={errors.provinceCode ? "border-red-500" : ""}
                        >
                          <SelectValue placeholder="Chọn tỉnh/thành" />
                        </SelectTrigger>
                        <SelectContent>
                          {provincesLoading ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              Đang tải...
                            </div>
                          ) : (
                            provincesData?.data?.map((province) => (
                              <SelectItem
                                key={province.code}
                                value={province.code}
                              >
                                {province.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {errors.provinceCode && (
                        <p className="text-xs text-red-500">
                          {errors.provinceCode}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Quận/Huyện</Label>
                      <Select
                        value={formData.wardCode}
                        onValueChange={handleWardChange}
                        disabled={!formData.provinceCode}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn quận/huyện" />
                        </SelectTrigger>
                        <SelectContent>
                          {wardsLoading ? (
                            <div className="p-2 text-center text-sm text-muted-foreground">
                              Đang tải...
                            </div>
                          ) : (
                            wardsData?.data?.map((ward) => (
                              <SelectItem key={ward.code} value={ward.code}>
                                {ward.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4 border-t pt-4 mt-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-base font-semibold">
                        Vị trí bản đồ (để tìm kiếm "Gần tôi")
                      </Label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          if (!navigator.geolocation) {
                            toast({
                              variant: "destructive",
                              title: "Lỗi",
                              description:
                                "Trình duyệt của bạn không hỗ trợ định vị",
                            });
                            return;
                          }

                          toast({
                            title: "Đang lấy vị trí...",
                            description: "Vui lòng cấp quyền truy cập vị trí",
                          });

                          navigator.geolocation.getCurrentPosition(
                            (position) => {
                              setFormData((prev) => ({
                                ...prev,
                                latitude: String(position.coords.latitude),
                                longitude: String(position.coords.longitude),
                              }));
                              toast({
                                title: "Thành công",
                                description: "Đã cập nhật vị trí hiện tại",
                              });
                            },
                            (error) => {
                              console.error("Location error:", error);
                              toast({
                                variant: "destructive",
                                title: "Không thể lấy vị trí",
                                description:
                                  "Vui lòng kiểm tra quyền truy cập vị trí",
                              });
                            }
                          );
                        }}
                      >
                        <MapPin className="w-4 h-4 mr-2" />
                        Lấy vị trí hiện tại
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="latitude">Vĩ độ (Latitude)</Label>
                        <Input
                          id="latitude"
                          value={formData.latitude}
                          readOnly
                          placeholder="Tự động cập nhật..."
                          className="bg-muted"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="longitude">Kinh độ (Longitude)</Label>
                        <Input
                          id="longitude"
                          value={formData.longitude}
                          readOnly
                          placeholder="Tự động cập nhật..."
                          className="bg-muted"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      * Việc cung cấp tọa độ giúp công việc của bạn hiển thị chính
                      xác hơn khi người dùng tìm kiếm "Gần tôi".
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Project Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="budget_min">
                        Ngân sách tối thiểu <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="budget_min"
                          type="number"
                          placeholder="0"
                          className={`pl-9 ${
                            errors.budget_min ? "border-red-500" : ""
                          }`}
                          value={formData.budget_min}
                          onChange={(e) =>
                            handleInputChange("budget_min", e.target.value)
                          }
                        />
                      </div>
                      {errors.budget_min && (
                        <p className="text-xs text-red-500">
                          {errors.budget_min}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="budget_max">
                        Ngân sách tối đa <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="budget_max"
                          type="number"
                          placeholder="0"
                          className={`pl-9 ${
                            errors.budget_max ? "border-red-500" : ""
                          }`}
                          value={formData.budget_max}
                          onChange={(e) =>
                            handleInputChange("budget_max", e.target.value)
                          }
                        />
                      </div>
                      {errors.budget_max && (
                        <p className="text-xs text-red-500">
                          {errors.budget_max}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deadline">
                        Hạn chót <span className="text-red-500">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          id="deadline"
                          type="date"
                          className={`pl-9 ${
                            errors.deadline ? "border-red-500" : ""
                          }`}
                          value={formData.deadline}
                          onChange={(e) =>
                            handleInputChange("deadline", e.target.value)
                          }
                        />
                      </div>
                      {errors.deadline && (
                        <p className="text-xs text-red-500">
                          {errors.deadline}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Mức độ ưu tiên</Label>
                      <Select
                        value={formData.priority}
                        onValueChange={(value) =>
                          handleInputChange("priority", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LOW">Thấp</SelectItem>
                          <SelectItem value="NORMAL">Bình thường</SelectItem>
                          <SelectItem value="HIGH">Cao</SelectItem>
                          <SelectItem value="URGENT">Khẩn cấp</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Skills & Images */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>
                      Kỹ năng yêu cầu <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.required_skill}
                      onValueChange={(value) =>
                        handleInputChange("required_skill", value)
                      }
                    >
                      <SelectTrigger
                        className={errors.required_skill ? "border-red-500" : ""}
                      >
                        <SelectValue placeholder="Chọn kỹ năng chính" />
                      </SelectTrigger>
                      <SelectContent>
                        {skillsLoading ? (
                          <div className="p-2 text-center text-sm text-muted-foreground">
                            Đang tải...
                          </div>
                        ) : (
                          skillsData?.map((skill: any) => (
                            <SelectItem
                              key={skill._id || skill.id}
                              value={skill._id || skill.id}
                            >
                              {skill.name}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    {errors.required_skill && (
                      <p className="text-xs text-red-500">
                        {errors.required_skill}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Hình ảnh tham khảo (URL)</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="https://example.com/image.jpg"
                        value={imageUrlInput}
                        onChange={(e) => setImageUrlInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleAddImageUrl();
                          }
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleAddImageUrl}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.images.map((url, index) => (
                        <div
                          key={index}
                          className="relative group rounded-lg overflow-hidden border w-24 h-24"
                        >
                          <img
                            src={url}
                            alt={`Reference ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveImageUrl(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1 || isSubmitting}
            >
              Quay lại
            </Button>
            {currentStep < 3 ? (
              <Button
                onClick={handleNext}
                className="bg-gradient-to-r from-primary to-accent"
              >
                Tiếp tục <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-primary to-accent"
              >
                {isSubmitting ? "Đang xử lý..." : "Đăng công việc"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
