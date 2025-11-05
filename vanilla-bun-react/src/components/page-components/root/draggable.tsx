import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { Eye, GripVertical } from "lucide-react";

const Draggable = ({
  data,
  parentContainer,
  className,
  gripClassName,
}: {
  data: Task | { id: number; title: string };
  parentContainer?: string | number;
  className?: string;
  gripClassName?: string;
}) => {
  const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
    id: data.id,
    data: {
      parentContainer,
      task: data,
    },
  });

  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "relative bg-primary/20",
        isDragging ? "opacity-40" : "opacity-100",
        className,
      )}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <div>
            <Dialog>
              <DialogTitle></DialogTitle>
              <DialogTrigger asChild>
                <Button
                  variant={"ghost"}
                  className="hover:cursor-pointer w-full min-w-full hover:bg-accent/20"
                >
                  {typeof data !== "number" && <p>{data.title}</p>}
                </Button>
              </DialogTrigger>
              {"description" in data ? (
                <DialogContent>
                  <DialogDescription>{data.description}</DialogDescription>
                </DialogContent>
              ) : (
                <DialogContent></DialogContent>
              )}
            </Dialog>
          </div>
          <div
            {...listeners}
            {...attributes}
            className={cn(
              "py-4 px-2 rounded-md hover:bg-accent/20 cursor-grab",
              gripClassName,
            )}
          >
            <GripVertical />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Draggable;
