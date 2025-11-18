import EmptyComponent from "@/components/state-components/empty";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PicTable } from "@/types";
import {
  memo,
  useContext,
  useEffect,
  type ComponentProps,
  type FC,
} from "react";
import DroppablePIC from "./droppable-pic";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import CreatePICForm from "./create-pic-form";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useGetPicList } from "@/api-hooks/queries";
import { DataContext } from "@/context";
import { useParams } from "@tanstack/react-router";

const SeatTable = memo(
  ({
    data,
  }: ComponentProps<"div"> & {
    data: PicTable;
  }) => {
    const params = useParams({ from: "/$projectId/" });
    const { localPics, setLocalPics } = useContext(DataContext)!;
    const { data: picList, isSuccess: picListSuccess } = useGetPicList({
      projectId: Number(params.projectId),
      seatTableId: data.id,
    });
    useEffect(() => {
      if (!picListSuccess) return;
      setLocalPics(picList);
    }, [picList, picListSuccess]);

    return (
      <Card className={cn("h-fit shadow-xl")}>
        <CardHeader aria-hidden className="flex justify-between relative">
          {data.tableName}
          <CreatePICDialog />
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {picListSuccess &&
            picList.map((p) => (
              <div
                key={p.id}
                className="flex flex-col items-center gap-2 text-center"
              >
                <DroppablePIC
                  id={`${data.id}${p.seatNumber}`}
                  pic={p}
                  seatTableId={data.id}
                />
                <Badge variant={"outline"}>{p.name}</Badge>
              </div>
            ))}
        </CardContent>
      </Card>
    );
  },
);

const CreatePICDialog: FC = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create PIC</DialogTitle>
        </DialogHeader>
        <DialogDescription aria-hidden />
        <CreatePICForm />
        <DialogFooter></DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SeatTable;
