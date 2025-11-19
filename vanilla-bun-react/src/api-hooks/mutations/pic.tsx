import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { TaskStatus } from "@/types/contants";
import { useParams } from "@tanstack/react-router";

const useCreatePic = () => {
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
      await queryClient.invalidateQueries({ queryKey: ["pic-list"] });
    },
  });
};

const useMovePic = () => {
  const params = useParams({ from: "/$projectId/" });
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      target?: { picId: number; seatTableId: number };
      current: { picId: number; seatTableId: number };
      type: "move" | "assign" | "unassign";
    }) => {
      const response = await API.put<
        { message: string },
        {
          target?: { picId: number; seatTableId: number };
          current: { picId: number; seatTableId: number };
          type: "move" | "assign" | "unassign";
        }
      >("/pic/", payload);

      return response;
    },
    onSuccess: async (_, { type }) => {
      await queryClient.invalidateQueries({
        queryKey: ["pic-list", Number(params.projectId)],
      });
      if (type !== "move") {
        await queryClient.invalidateQueries({
          queryKey: ["unassigned-pic-list", Number(params.projectId)],
        });
      }
    },
  });
};

export { useCreatePic, useMovePic };
