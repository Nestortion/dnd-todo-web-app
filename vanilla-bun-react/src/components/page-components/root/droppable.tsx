import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useDndContext, useDroppable } from "@dnd-kit/core";
import { memo, useState, type ComponentProps } from "react";
import Draggable from "./draggable";
import type { Task } from "@/types";
import { NotepadText, Plus, UserRoundX } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@tanstack/react-form";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createTaskSchema } from "@/schemas/tasks";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import z from "zod";
import { useCreateTask } from "@/api-hooks/mutations/task";
import { useGetPicList } from "@/api-hooks/queries";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import EmptyComponent from "@/components/state-components/empty";
import type { TaskStatus } from "@/types/contants";

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
          "h-fit shadow-xl",
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

const defaultValues: z.infer<typeof createTaskSchema> = {
  title: "",
  description: "",
};

const CreateTaskDialog = () => {
  const { data: picList, isSuccess } = useGetPicList();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createTaskSchema,
      onChange: createTaskSchema,
    },
    onSubmit: async ({ value }) => {
      toast.promise(createTaskMutation.mutateAsync(value), {
        loading: "Creating task...",
        success: (data) => {
          setDialogOpen(false);
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      });
    },
  });
  const createTaskMutation = useCreateTask();

  return (
    <Dialog
      open={dialogOpen}
      onOpenChange={(e) => {
        if (!e) {
          form.reset();
        }
        setDialogOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant={"ghost"}
          className=" h-fit hover:cursor-pointer rounded-full hover:bg-primary/20 dark:hover:bg-primary/20"
        >
          <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create new task</DialogTitle>
        </DialogHeader>
        <DialogDescription aria-hidden />
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <form.Field
              name="title"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Title..."
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="description"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      aria-invalid={isInvalid}
                      placeholder="Description..."
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <FieldGroup>
            <form.Field
              name="picId"
              children={(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Assignee</FieldLabel>
                    <Select
                      name={field.name}
                      value={String(field.state.value)}
                      onValueChange={(val) => field.handleChange(Number(val))}
                    >
                      <SelectTrigger
                        onBlur={field.handleBlur}
                        id={field.name}
                        aria-invalid={isInvalid}
                      >
                        {isSuccess ? (
                          <>
                            {picList.picList.find(
                              (p) => p.id === field.state.value,
                            )?.name ?? (
                              <p className="text-muted-foreground">
                                Assignee...
                              </p>
                            )}
                          </>
                        ) : (
                          <Spinner />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        {isSuccess && picList.picList.length > 0 ? (
                          <SelectGroup>
                            <SelectLabel>Assignees</SelectLabel>
                            {picList.picList.map((pic) => (
                              <SelectItem value={String(pic.id)} key={pic.id}>
                                {pic.name}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        ) : (
                          <EmptyComponent
                            className="bg-background m-4"
                            icon={<UserRoundX />}
                            title="No Assignees Found"
                            description="No assignees are currently available"
                          />
                        )}
                      </SelectContent>
                    </Select>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            />
          </FieldGroup>
          <Button>Create</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Droppable;
