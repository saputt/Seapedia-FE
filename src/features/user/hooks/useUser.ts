import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, updateProfile, changePassword, uploadProfileImage } from "../api/user.api";
import useAuthStore from "../../auth/store/authStore";

export const useProfile = (options = {}) =>
  useQuery({
    queryKey: ["profile"],
    queryFn: getProfile,
    ...options,
  });

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: ({ username }: { username: string }) => updateProfile(username),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUpdateProfileImage = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);
  return useMutation({
    mutationFn: (file: File) => uploadProfileImage(file),
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: ({ oldPassword, newPassword }: { oldPassword: string; newPassword: string }) =>
      changePassword(oldPassword, newPassword),
  });
};
