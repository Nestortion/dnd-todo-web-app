import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { PIC } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import type { ComponentProps, FC } from "react";

type Props = ComponentProps<"div"> & {
  dragId?: number;
  pic?: PIC;
};

const DraggableUnassignedPic: FC<Props> = ({
  dragId,
  pic,
  className,
  ...rest
}) => {
  const { listeners, attributes, setNodeRef, isDragging } = useDraggable({
    id: `draggable-unassigned-pic-${dragId}`,
    data: {
      pic,
      type: "draggable-unassigned",
    },
  });
  return (
    <Card
      {...listeners}
      {...attributes}
      {...rest}
      ref={setNodeRef}
      className={cn(
        "relative bg-primary/20 shadow-md p-2",
        isDragging ? "opacity-40" : "opacity-100",
        className,
      )}
    >
      {/* <CardHeader /> */}
      <CardContent className="flex gap-2 items-center">
        <Avatar className="border border-primary">
          <AvatarImage src={pic!.profileImage} />
          <AvatarFallback>
            {pic!.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <p>{pic!.name}</p>
      </CardContent>
      {/* <CardFooter /> */}
    </Card>
  );
};

export default DraggableUnassignedPic;
