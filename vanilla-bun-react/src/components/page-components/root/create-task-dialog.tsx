import { useCreateTask } from "@/api-hooks/mutations";
import { useGetPicList } from "@/api-hooks/queries";
import EmptyComponent from "@/components/state-components/empty";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createTaskSchema, type CreateTask } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import { Plus, UserRoundX } from "lucide-react";
import { memo, useState } from "react";
import { toast } from "sonner";

const CreateTaskDialog = memo(() => {
  const params = useParams({ from: "/$projectId/" });
  const { data: picList, isSuccess } = useGetPicList({
    projectId: Number(params.projectId),
  });
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const defaultValues: CreateTask = {
    title: "",
    description: "",
    projectId: Number(params.projectId),
  };

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
        form.reset();
        setDialogOpen(e);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"outline"}>
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
                            {picList.find((p) => p.id === field.state.value)
                              ?.name ?? (
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
                        {isSuccess && picList.length > 0 ? (
                          <SelectGroup>
                            <SelectLabel>Assignees</SelectLabel>
                            {picList.map((pic) => (
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
        </form>
        <DialogFooter>
          <Button
            onClick={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
});

export default CreateTaskDialog;
