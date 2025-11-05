import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "./helpers/api-methods";
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
