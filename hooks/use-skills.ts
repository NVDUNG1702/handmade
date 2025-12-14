import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as skillsApi from "@/lib/api-skills";
import { toast } from "sonner";
import type { CreateUserSkillDto } from "@/lib/types";

// Hook để lấy danh sách tất cả skills
export function useSkills() {
  return useQuery({
    queryKey: ["skills"],
    queryFn: async () => {
      try {
        const response = await skillsApi.getAllSkills();
        
        // Kiểm tra cấu trúc response và trả về array
        let skillsData = response.data.data;

        // Nếu response.data không phải array, kiểm tra các trường khác
        if (!Array.isArray(skillsData)) {
           // Fallback logic if needed, similar to handmade-fe
           console.warn("Skills data is not an array");
           return [];
        }

        return skillsData;
      } catch (error) {
        console.error("Error fetching skills:", error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000, // 10 phút
  });
}

// Hook để tìm kiếm skills
export function useSearchSkills(query: string) {
  return useQuery({
    queryKey: ["skills", "search", query],
    queryFn: async () => {
      const response = await skillsApi.searchSkills(query);
      return response.data.data;
    },
    enabled: query.length > 0,
    staleTime: 2 * 60 * 1000, // 2 phút
    gcTime: 5 * 60 * 1000, // 5 phút
  });
}

// Hook để lấy skills của user
export function useUserSkills(userId: string) {
  return useQuery({
    queryKey: ["user-skills", userId],
    queryFn: async () => {
      const response = await skillsApi.getUserSkills(userId);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}

// Hook mutation để tạo user skill mới
export function useCreateUserSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateUserSkillDto) => {
      console.log("Creating user skill with data:", data);
      const response = await skillsApi.createUserSkill(data);
      console.log("Create skill response:", response);
      return response.data;
    },
    onSuccess: (data, variables) => {
      console.log("Mutation success! Invalidating queries for userId:", variables.userId);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ["user-skills", variables.userId] });
      queryClient.invalidateQueries({ queryKey: ["skills"] });
      console.log("Queries invalidated");
    },
    onError: (error: any) => {
      console.error("Mutation error:", error);
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
    },
  });
}

// Hook mutation để update user skill
export function useUpdateUserSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: import("@/lib/types").UpdateUserSkillDto }) => {
      const response = await skillsApi.updateUserSkill(id, data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-skills"] });
      toast.success("Cập nhật kỹ năng thành công!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể cập nhật kỹ năng";
      toast.error(errorMessage);
    },
  });
}

// Hook mutation để delete user skill (soft delete)
export function useDeleteUserSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await skillsApi.deleteUserSkill(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-skills"] });
      toast.success("Đã xóa kỹ năng!");
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.message || error?.message || "Không thể xóa kỹ năng";
      toast.error(errorMessage);
    },
  });
}
