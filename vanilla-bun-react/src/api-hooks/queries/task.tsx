import { useQuery } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { Task } from "@/types";

const useGetTasks = () => {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: async () => {
      const data = await API.get<Array<Task>>("/task/");
      return data;
    },
    staleTime: Infinity,
  });
};

export { useGetTasks };
