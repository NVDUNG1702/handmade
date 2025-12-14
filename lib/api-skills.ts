import axiosInstance from "@/lib/axios-instance";
import { API_CONSTANTS } from "@/lib/api-constants";
import { ApiResponse, Skill, UserSkill } from "@/lib/types";

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
  axiosInstance.get<ApiResponse<UserSkill[]>>(`/skills/user-skills/${userId}`);

// Create user skill
export const createUserSkill = (data: any) =>
  axiosInstance.post<ApiResponse<any>>("/skills/user-skills", data);

// Update user skill
export const updateUserSkill = (id: string, data: any) =>
  axiosInstance.patch<ApiResponse<any>>(`/skills/user-skills/${id}`, data);

// Delete user skill
export const deleteUserSkill = (id: string) =>
  axiosInstance.delete<ApiResponse<null>>(`/skills/user-skills/${id}`);

// Get completed jobs by user
export const getCompletedJobs = (userId: string, skillId?: string) => {
  const params = skillId ? { skill_id: skillId, status: 'COMPLETED' } : { status: 'COMPLETED' };
  return axiosInstance.get<ApiResponse<any[]>>(
    `/users/${userId}/completed-jobs`,
    { params }
  );
};

// Get skill statistics
export const getSkillStats = (skillId: string) =>
  axiosInstance.get<ApiResponse<any>>(
    `/skills/${skillId}/stats`
  );
