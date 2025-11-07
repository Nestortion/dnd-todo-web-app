import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { memo, type ComponentProps } from "react";
import defaultPic from "@/assets/default-picture.webp";

const DroppablePIC = memo(
  ({
    id,
  }: ComponentProps<"div"> & {
    id: string | number;
    header: string;
  }) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
    });

    return (
      <Card
        ref={setNodeRef}
        className={cn(
          isOver ? "bg-primary" : "bg-secondary",
          "h-fit p-0 shadow-xl w-fit rounded-full",
        )}
      >
        <CardHeader hidden className="flex justify-between relative">
          <CardTitle>{}</CardTitle>
        </CardHeader>
        <CardContent className="p-2 h-fit">
          <img
            src={defaultPic}
            className="aspect-square w-32 rounded-full"
            alt=""
          />
        </CardContent>
      </Card>
    );
  },
);
export default DroppablePIC;
