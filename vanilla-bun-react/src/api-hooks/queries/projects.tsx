import { useQuery } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { Project } from "@/types";

export const useGetProjects = () => {
  return useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const data = await API.get<Array<Project>>("/project/");
      return data;
    },
    staleTime: Infinity,
  });
};

export const useGetProject = (projectId: number) => {
  return useQuery({
    queryKey: ["projects", projectId],
    queryFn: async () => {
      const data = await API.get<Project>("/project/" + projectId);
      return data;
    },
    staleTime: Infinity,
  });
};
