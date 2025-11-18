import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
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
  createSeatTableSchema,
  type CreateSeatTable,
} from "@/schemas/seat-tables";
import { DialogDescription } from "@radix-ui/react-dialog";
import { useForm } from "@tanstack/react-form";
import { useParams } from "@tanstack/react-router";
import type { Dispatch, FC, ReactNode, SetStateAction } from "react";

type Props = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  trigger?: ReactNode;
};

const CreateTableDialog: FC<Props> = ({ open, setOpen, trigger }) => {
  const params = useParams({ from: "/$projectId/" });

  const defaultValues: CreateSeatTable = {
    tableName: "",
    description: "",
    projectId: Number(params.projectId),
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createSeatTableSchema,
      onChange: createSeatTableSchema,
    },
    onSubmit: async ({ value }) => {},
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? trigger : <Button>Create Table</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Table</DialogTitle>
        </DialogHeader>
        <DialogDescription aria-hidden hidden />
        {/* form */}
        <form>
          <FieldGroup>
            <form.Field
              name="tableName"
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
                      placeholder="Table Name..."
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
};

export default CreateTableDialog;
