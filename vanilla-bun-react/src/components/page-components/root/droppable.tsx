import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { type ComponentProps } from "react";
import Draggable from "./draggable";
import type { Task } from "@/types";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";

const Droppable = ({
  id,
  data,
  header,
}: ComponentProps<"div"> & {
  id: string | number;
  data: Array<Task>;
  header: string;
}) => {
  const { isOver, setNodeRef } = useDroppable({
    id,
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(isOver ? "bg-primary/20" : "bg-secondary", "h-fit")}
    >
      <CardContent>
        <CardHeader className="text-center text-xl font-bold">
          {header}
        </CardHeader>

        <div className="flex flex-col gap-2">
          {data && data.length > 0 ? (
            data.map((d, index) => {
              return <Draggable parentContainer={id} key={index} data={d} />;
            })
          ) : (
            <EmptyComponent />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

const EmptyComponent = () => {
  return (
    <Empty className="bg-background">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <NotepadText />
        </EmptyMedia>
        <EmptyTitle className="text-primary">No Tasks Here Yet</EmptyTitle>
        <EmptyDescription>No task has been moved here yet</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default Droppable;
