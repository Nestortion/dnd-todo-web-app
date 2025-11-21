import { useQuery } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { PIC } from "@/types";

export const useGetPicList = ({
  projectId,
  seatTableId,
}: {
  projectId?: number;
  seatTableId?: number;
}) => {
  const searchParams = new URLSearchParams({
    projectId: String(projectId),
    seatTableId: String(seatTableId),
  });
  if (!projectId) searchParams.delete("projectId");
  if (!seatTableId) searchParams.delete("seatTableId");

  return useQuery({
    queryKey: ["pic-list", projectId, seatTableId],
    queryFn: async () => {
      const data = await API.get<Array<PIC>>("/pic/?" + searchParams);
      return data.map((d) => ({ ...d, seatTableId }));
    },
    staleTime: Infinity,
  });
};

export const useGetTablePics = (projectId: number) => {
  return useQuery({
    queryKey: ["table-pic-list", projectId],
    queryFn: async () => {
      const data = await API.get<Record<number, Array<PIC>>>(
        "/pic/table-pics/" + projectId,
      );
      return data;
    },
    staleTime: Infinity,
  });
};

export const useGetUnassignedPics = (projectId: number) => {
  return useQuery({
    queryKey: ["unassigned-pic-list", projectId],
    queryFn: async () => {
      const data = await API.get<Array<PIC>>("/pic/unassigned/" + projectId);
      return data;
    },
    staleTime: Infinity,
  });
};
