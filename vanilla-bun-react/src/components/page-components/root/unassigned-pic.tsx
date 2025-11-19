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
import { useContext, useEffect, type FC } from "react";
import { cn } from "@/lib/utils";
import { DataContext } from "@/context";

const UnassignedPic: FC = () => {
  const params = useParams({ from: "/$projectId/" });

  const { data, isSuccess } = useGetUnassignedPics(Number(params.projectId));
  const { unassignedPics, setUnassignedPics } = useContext(DataContext)!;

  const { isOver, setNodeRef: dropRef } = useDroppable({
    id: `droppable-unassigned-table`,
  });
  useEffect(() => {
    if (!isSuccess) return;
    // if(data.id in localPics!){}
    setUnassignedPics(data);
  }, [data, isSuccess]);
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
          unassignedPics &&
          unassignedPics.map((pic) => (
            <DraggableUnassignedPic key={pic.id} dragId={pic.id} pic={pic} />
          ))}
      </CardContent>
      <CardFooter></CardFooter>
    </Card>
  );
};

export default UnassignedPic;
