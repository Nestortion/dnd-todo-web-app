import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import { useEffect, type ComponentProps } from "react";
import Draggable from "./draggable";

const Droppable = ({
  id,
  data,
}: ComponentProps<"div"> & {
  id: string | number;
  data: Array<string>;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(isOver ? "bg-primary" : "bg-secondary", "w-80 h-fit")}
    >
      <CardContent>
        <CardHeader>Drop here</CardHeader>

        <div className="flex flex-col gap-2">
          {data.map((d, index) => {
            return <Draggable parentContainer={id} key={index} id={d} />;
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Droppable;
