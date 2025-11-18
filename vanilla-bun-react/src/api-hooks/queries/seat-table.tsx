import { useQuery } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { PicTable } from "@/types";

const useGetSeatTables = (projectId?: number) => {
  return useQuery({
    queryKey: ["seat-tables", projectId],
    queryFn: async () => {
      const data = await API.get<Array<PicTable>>(
        "/seat-table/?" + new URLSearchParams({ projectId: String(projectId) }),
      );
      return data;
    },
    staleTime: Infinity,
  });
};

export { useGetSeatTables };
