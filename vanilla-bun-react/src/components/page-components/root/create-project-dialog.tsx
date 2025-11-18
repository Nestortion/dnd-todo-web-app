import { useCreateProject } from "@/api-hooks/mutations/projects";
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
import { createProjectSchema, type CreateProject } from "@/schemas";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { FolderPlus } from "lucide-react";
import { useState, type Dispatch, type FC, type SetStateAction } from "react";
import { toast } from "sonner";

const defaultValues: CreateProject = {
  projectName: "",
  description: "",
};

type Props = {
  setParentOpen?: Dispatch<SetStateAction<boolean>>;
};

const CreateProjectDialog: FC<Props> = ({ setParentOpen }) => {
  const [open, setOpen] = useState<boolean>(false);

  const createProjectMutation = useCreateProject();

  const navigate = useNavigate();

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createProjectSchema,
      onChange: createProjectSchema,
    },
    onSubmit: async ({ value }) => {
      toast.promise(createProjectMutation.mutateAsync(value), {
        loading: "Creating task...",
        success: (data) => {
          navigate({
            to: `/$projectId`,
            params: { projectId: String(data.projectId) },
          });
          setOpen(false);
          if (setParentOpen) setParentOpen(false);
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      });
    },
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={"ghost"}>
          <FolderPlus className="hover:cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Project</DialogTitle>
        </DialogHeader>
        {/* form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit();
          }}
          className="flex flex-col gap-4"
        >
          <FieldGroup>
            <form.Field
              name="projectName"
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
                      placeholder="Project Name..."
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
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
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
        </form>
        <DialogDescription aria-hidden hidden />
        <DialogFooter className="w-full">
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
};

export default CreateProjectDialog;
