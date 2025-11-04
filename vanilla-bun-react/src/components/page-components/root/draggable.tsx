import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useDndContext, useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { Eye, GripVertical } from "lucide-react";

const Draggable = ({
  id,
  parentContainer,
  className,
  gripClassName,
}: {
  id: string | number;
  parentContainer?: string | number;
  className?: string;
  gripClassName?: string;
}) => {
  const { setNodeRef, listeners, attributes, transform, isDragging } =
    useDraggable({
      id,
      data: {
        parentContainer,
      },
    });

  const style = {
    transform: CSS.Translate.toString(transform),
  };
  return (
    <Card
      ref={setNodeRef}
      className={cn(
        "w-64 relative",
        isDragging ? "opacity-40" : "opacity-100",
        className,
      )}
    >
      <CardContent>
        <div className="flex justify-between items-center">
          <div
            {...listeners}
            {...attributes}
            className={cn(
              "py-4 px-2 rounded-md hover:bg-accent cursor-grab",
              gripClassName,
            )}
          >
            <GripVertical />
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Eye />
                </Button>
              </DialogTrigger>
              <DialogContent>Something</DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Draggable;
