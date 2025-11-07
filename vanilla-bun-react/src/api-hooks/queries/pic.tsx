import { useQuery } from "@tanstack/react-query";
import API from "../helpers/api-methods";
import type { PIC } from "@/types";

const useGetPicList = () => {
  return useQuery({
    queryKey: ["pic-list"],
    queryFn: async () => {
      const data = await API.get<{ picList: Array<PIC> }>("/pic/");
      return data;
    },
    staleTime: Infinity,
  });
};

export { useGetPicList };
