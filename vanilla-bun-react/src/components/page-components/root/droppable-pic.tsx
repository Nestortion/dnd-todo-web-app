import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { memo, type ComponentProps } from "react";
import type { PIC } from "@/types";

const DroppablePIC = memo(
  ({
    id,
    pic,
    className,
    seatTableId,
  }: ComponentProps<"div"> & {
    id: string | number;
    pic?: PIC;
    seatTableId?: number;
  }) => {
    const {
      setNodeRef: dragRef,
      listeners,
      attributes,
      isDragging,
    } = useDraggable({
      id: `draggable-seat-${id}`,
      data: { type: "draggable", pic: { ...pic, seatTableId } },
    });

    const { isOver, setNodeRef: dropRef } = useDroppable({
      id: `droppable-seat-${id}`,
      disabled: isDragging,
      data: { type: "droppable", pic: { ...pic, seatTableId } },
    });

    return (
      <div
        {...listeners}
        {...attributes}
        ref={dragRef}
        className={cn(
          "relative w-fit rounded-full overflow-hidden",
          isDragging ? "opacity-40" : "opacity-100",
          className,
        )}
      >
        <Card
          ref={dropRef}
          className={cn(
            isOver // && String(con.active?.id).includes("draggable-seat")
              ? "bg-primary"
              : "bg-secondary",
            "h-fit p-0 shadow-xl w-fit rounded-full hover:bg-primary hover:cursor-pointer",
          )}
        >
          <CardHeader hidden className="flex justify-between relative">
            <CardTitle>{}</CardTitle>
          </CardHeader>
          <CardContent className="p-2 h-fit">
            <img
              src={pic?.profileImage}
              className="aspect-square w-32 rounded-full text-center"
              alt={pic?.id.toString() ?? ""}
            />
            {/* {pic?.name} */}
          </CardContent>
        </Card>
      </div>
    );
  },
);
export default DroppablePIC;
