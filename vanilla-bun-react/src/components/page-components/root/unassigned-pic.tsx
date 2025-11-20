import { useGetUnassignedPics } from "@/api-hooks/queries";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useParams } from "@tanstack/react-router";
import DraggableUnassignedPic from "./draggable-unassigned-pic";
import { useDroppable } from "@dnd-kit/core";
import { memo, type FC } from "react";
import { cn } from "@/lib/utils";

const UnassignedPic: FC = memo(() => {
  const params = useParams({ from: "/$projectId/" });

  const { data, isSuccess } = useGetUnassignedPics(Number(params.projectId));

  const { isOver, setNodeRef: dropRef } = useDroppable({
    id: `droppable-unassigned-table`,
  });
  return (
    <Card
      ref={dropRef}
      className={cn(isOver ? "bg-primary" : "bg-background", "h-fit max-h-80")}
    >
      <CardHeader>
        <CardTitle>Unassigned Pics</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {isSuccess &&
          data.map((pic) => (
            <DraggableUnassignedPic key={pic.id} dragId={pic.id} pic={pic} />
          ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
});

export default UnassignedPic;
