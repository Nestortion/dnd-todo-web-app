import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PIC, PicTable } from "@/types";
import { memo, type ComponentProps, type FC } from "react";
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
import { useDroppable } from "@dnd-kit/core";

const SeatTable = memo(
  ({
    data,
    picList,
  }: ComponentProps<"div"> & {
    data: PicTable;
    picList: Array<PIC>;
  }) => {
    const { setNodeRef, isOver } = useDroppable({
      id: `droppable-table-${data.id}`,
      data: {
        table: data,
      },
    });

    return (
      <Card
        ref={setNodeRef}
        className={cn(
          "h-fit shadow-xl",
          isOver ? "bg-primary" : "bg-secondary",
        )}
      >
        <CardHeader aria-hidden className="flex justify-between relative">
          {data.tableName}
          <CreatePICDialog />
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          {picList.map((p, index) => (
            <div
              key={index}
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

const CreatePICDialog: FC = memo(() => {
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
});

export default SeatTable;
