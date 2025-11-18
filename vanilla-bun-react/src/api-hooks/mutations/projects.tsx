import { useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../helpers/api-methods";

export const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: {
      projectName: string;
      description: string;
    }) => {
      const response = await API.post<
        { message: string; projectId: number },
        {
          projectName: string;
          description: string;
        }
      >("/project/", payload);

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: async () => {
      // do something if project creation fails
    },
  });
};
