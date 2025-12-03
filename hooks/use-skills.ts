import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as skillsApi from "@/lib/api-skills";

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
