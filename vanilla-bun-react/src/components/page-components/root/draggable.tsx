import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { Task } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { DialogDescription, DialogTrigger } from "@radix-ui/react-dialog";
import { memo } from "react";

const Draggable = memo(
  ({ data, className }: { data: Task; className?: string }) => {
    const { setNodeRef, listeners, attributes, isDragging } = useDraggable({
      id: data.id,
      data: {
        task: data,
        type: "draggable-task",
      },
    });

    return (
      <Card
        {...listeners}
        {...attributes}
        ref={setNodeRef}
        className={cn(
          "relative bg-primary/20 shadow-md p-2",
          isDragging ? "opacity-40" : "opacity-100",
          className,
        )}
      >
        <DraggableContent data={data} />
      </Card>
    );
  },
);
type DraggableContentProps = {
  data: Task;
};

const DraggableContent = memo(({ data }: DraggableContentProps) => {
  return (
    <CardContent className="p-0 space-y-2">
      <div className="flex justify-between items-center">
        <div className="w-full">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant={"ghost"}
                className="hover:cursor-pointer w-full hover:bg-accent/20 font-mono h-fit text-start whitespace-pre-wrap"
              >
                <p className="w-full wrap-anywhere">{data.title}</p>
              </Button>
            </DialogTrigger>
            {data ? (
              <DialogContent>
                <DialogHeader className="text-xl font-bold">
                  <DialogTitle>{data.title}</DialogTitle>
                </DialogHeader>
                <DialogDescription>{data.description}</DialogDescription>
                <DialogFooter>
                  <Badge>test</Badge>
                </DialogFooter>
              </DialogContent>
            ) : (
              <DialogContent aria-hidden />
            )}
          </Dialog>
        </div>
      </div>
      <CardFooter className="p-0 px-4 justify-between items-center">
        <Badge>{new Date().toLocaleDateString()}</Badge>
        <Avatar className="border border-primary">
          <AvatarImage
            src={`https://picsum.photos/id/${data.pic.id}/200/300`}
          />
          <AvatarFallback>
            {data.pic.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </CardFooter>
    </CardContent>
  );
});

export default Draggable;
