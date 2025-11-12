import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { TaskStatus } from "@/types/contants";

export const useMoveTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { taskId: number; status: TaskStatus }) => {
      const response = await API.put<
        { message: string },
        { taskId: number; status: TaskStatus }
      >("/task/", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      title: string;
      description: string;
      picId?: number;
    }) => {
      const response = await API.post<
        { message: string },
        {
          title: string;
          description: string;
          picId?: number;
        }
      >("/task/", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useAssignTask = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: { taskId: number; picId: number }) => {
      const response = await API.put<
        { message: string },
        {
          taskId: number;
          picId: number;
        }
      >("/task/assign", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};
