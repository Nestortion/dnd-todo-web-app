import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { memo, useEffect, useState, type ComponentProps } from "react";
import Draggable from "./draggable";
import type { Task } from "@/types";
import { FoldVertical, NotepadText, UnfoldVertical } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import EmptyComponent from "@/components/state-components/empty";
import type { TaskStatus } from "@/types/contants";
import CreateTaskDialog from "./create-task-dialog";
import { boolean } from "zod";
import { Button } from "@/components/ui/button";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";

const Droppable = memo(
  ({
    id,
    data,
    status,
    isExpanded,
  }: ComponentProps<"div"> & {
    id: string | number;
    data: Array<Task>;
    status: TaskStatus;
    isExpanded: boolean;
  }) => {
    const con = useDndContext();

    const { isOver, setNodeRef } = useDroppable({
      id,
    });

    const [expand, setExpand] = useState<boolean>(isExpanded);

    useEffect(() => {
      setExpand(isExpanded);
    }, [isExpanded]);

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
          expand ? "gap-6" : "gap-0",
          "transition-all duration-500",
        )}
      >
        <CardHeader className="flex justify-between">
          <CardTitle className="flex flex-col gap-2">
            <div className={`${statusColor} w-full h-2 rounded-md`} />
            {status}
          </CardTitle>
          <ButtonGroup>
            <Button
              variant={"outline"}
              onClick={() => setExpand((prev) => !prev)}
            >
              {expand ? <FoldVertical /> : <UnfoldVertical />}
            </Button>
            {id === "backlog-container" && (
              <>
                <ButtonGroupSeparator />
                <CreateTaskDialog />
              </>
            )}
          </ButtonGroup>
        </CardHeader>
        <CardContent className="px-2 w-80">
          <ScrollArea>
            <div
              className={cn(
                "flex flex-col gap-2 px-4",
                expand ? "max-h-80" : "max-h-0",
                "transition-all duration-500",
              )}
            >
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
