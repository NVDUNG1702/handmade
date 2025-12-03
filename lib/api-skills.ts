import axiosInstance from "@/lib/axios-instance";
import { API_CONSTANTS } from "@/lib/api-constants";
import { ApiResponse, Skill } from "@/lib/types";

// Get all skills
export const getAllSkills = () =>
  axiosInstance.get<ApiResponse<Skill[]>>(API_CONSTANTS.ENDPOINTS.SKILLS.LIST);

// Search skills
export const searchSkills = (query: string) =>
  axiosInstance.get<ApiResponse<Skill[]>>(
    `${API_CONSTANTS.ENDPOINTS.SKILLS.LIST}?search=${query}`
  );

// Get user skills
export const getUserSkills = (userId: string) =>
  axiosInstance.get<ApiResponse<any[]>>(`/users/${userId}/skills`);

// Create user skill
export const createUserSkill = (data: any) =>
  axiosInstance.post<ApiResponse<any>>("/user-skills", data);

// Update user skill
export const updateUserSkill = (id: string, data: any) =>
  axiosInstance.put<ApiResponse<any>>(`/user-skills/${id}`, data);

// Delete user skill
export const deleteUserSkill = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/user-skills/${id}`);
