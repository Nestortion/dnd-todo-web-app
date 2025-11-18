import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { memo, type ComponentProps } from "react";
import Draggable from "./draggable";
import type { Task } from "@/types";
import { NotepadText } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyComponent from "@/components/state-components/empty";
import type { TaskStatus } from "@/types/contants";
import CreateTaskDialog from "./create-task-dialog";

const Droppable = memo(
  ({
    id,
    data,
    status,
  }: ComponentProps<"div"> & {
    id: string | number;
    data: Array<Task>;
    status: TaskStatus;
  }) => {
    const con = useDndContext();

    const { isOver, setNodeRef } = useDroppable({
      id,
    });

    let statusColor;

    switch (status) {
      case "Backlog":
        statusColor = "bg-backlog";
        break;
      case "In Progress":
        statusColor = "bg-in-progress";
        break;
      case "Completed":
        statusColor = "bg-completed";
        break;
      case "For Testing":
        statusColor = "bg-testing";
        break;
      case "Reject":
        statusColor = "bg-reject";
        break;
      case "Finished":
        statusColor = "bg-finished";
        break;
      default:
        statusColor = "";
        break;
    }

    return (
      <Card
        ref={setNodeRef}
        className={cn(
          isOver && con.active?.data.current?.type === "draggable-task"
            ? "bg-primary/20"
            : "bg-secondary",
          "h-fit shadow-lg",
          "w-80",
        )}
      >
        <CardHeader className="flex justify-between relative">
          <CardTitle className="flex flex-col gap-2">
            <div className={`${statusColor} w-full h-2 rounded-md`} />

            {status}
          </CardTitle>
          {id === "backlog-container" && <CreateTaskDialog />}
        </CardHeader>
        <CardContent className="px-2">
          <ScrollArea>
            <div className="flex flex-col gap-2 max-h-80 px-4">
              {data && data.length > 0 ? (
                data.map((d, index) => {
                  return <Draggable key={index} data={d} />;
                })
              ) : (
                <EmptyComponent
                  className="bg-background"
                  icon={<NotepadText />}
                  title="No Tasks Here Yet"
                  description="No tasks has been moved here yet."
                />
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    );
  },
);

export default Droppable;
