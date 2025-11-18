import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { TaskStatus } from "@/types/contants";

const useCreatePic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { taskId: number; status: TaskStatus }) => {
      const response = await API.put<
        { message: string },
        { taskId: number; status: TaskStatus }
      >("/seat-table/", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pic-list"] });
    },
  });
};

const useMovePic = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      targetPicId: number;
      selectedPicId: number;
    }) => {
      const response = await API.put<
        { message: string },
        { targetPicId: number; selectedPicId: number }
      >("/pic/", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["pic-list"] });
    },
  });
};

export { useCreatePic, useMovePic };
