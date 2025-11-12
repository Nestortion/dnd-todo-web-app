import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndContext, useDraggable, useDroppable } from "@dnd-kit/core";
import { memo, type ComponentProps } from "react";
import defaultPic from "@/assets/default-picture.webp";
import type { PIC } from "@/types";

const DroppablePIC = memo(
  ({
    id,
    pic,
    className,
  }: ComponentProps<"div"> & {
    id: string | number;
    pic?: PIC;
  }) => {
    const con = useDndContext();
    const {
      setNodeRef: dragRef,
      listeners,
      attributes,
      isDragging,
    } = useDraggable({
      id: `draggable-seat-${id}`,
      data: { type: "draggable", pic },
    });

    const { isOver, setNodeRef: dropRef } = useDroppable({
      id: `droppable-seat-${id}`,
      disabled: isDragging,
      data: { type: "droppable", pic },
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
              src={`https://picsum.photos/id/${pic?.id}/200/300`}
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
