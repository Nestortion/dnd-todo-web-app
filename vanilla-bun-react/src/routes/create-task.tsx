import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/create-task")({
  component: CreateTask,
});

function CreateTask() {
  return (
    <div className="flex justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>Create task</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>content</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
