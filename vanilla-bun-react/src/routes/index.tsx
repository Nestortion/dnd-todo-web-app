import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragMoveEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Draggable from "@/components/page-components/root/draggable";
import Droppable from "@/components/page-components/root/droppable";
import { useEffect, useMemo, useState } from "react";
import { useGetTasks } from "@/api-hooks/queries";
import { useMoveTask } from "@/api-hooks/mutations";
import type { Task } from "@/types";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { data, isSuccess } = useGetTasks();
  const [activeTask, setActiveTask] = useState<{ id: number; title: string }>();
  const [localTasks, setLocaltasks] = useState<Array<Task>>();

  const moveTaskMutation = useMoveTask();

  const backlogTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "Backlog");
  }, [localTasks]);
  const inProgressTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "In Progress");
  }, [localTasks]);
  const completedTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "Completed");
  }, [localTasks]);
  const forTestingTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "For Testing");
  }, [localTasks]);
  const finishedTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "Finished");
  }, [localTasks]);

  useEffect(() => {
    if (!isSuccess) return;
    setLocaltasks(data.tasks);
  }, [data, isSuccess]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    if (over) {
      if (over.id === "backlog-container") {
        if (backlogTasks?.some((d) => d.id === active.id)) return;
        setLocaltasks((prev) => {
          return prev?.map((t) => {
            if (t.id === active.id) return { ...t, status: "Backlog" };
            return t;
          });
        });
        await moveTaskMutation.mutateAsync({
          taskId: Number(active.id),
          status: "Backlog",
        });
      } else if (over.id === "inprogress-container") {
        if (inProgressTasks?.some((d) => d.id === active.id)) return;
        setLocaltasks((prev) => {
          return prev?.map((t) => {
            if (t.id === active.id) return { ...t, status: "In Progress" };
            return t;
          });
        });
        await moveTaskMutation.mutateAsync({
          taskId: Number(active.id),
          status: "In Progress",
        });
      } else if (over.id === "completed-container") {
        if (completedTasks?.some((d) => d.id === active.id)) return;
        setLocaltasks((prev) => {
          return prev?.map((t) => {
            if (t.id === active.id) return { ...t, status: "Completed" };
            return t;
          });
        });
        await moveTaskMutation.mutateAsync({
          taskId: Number(active.id),
          status: "Completed",
        });
      } else if (over.id === "fortesting-container") {
        if (forTestingTasks?.some((d) => d.id === active.id)) return;
        setLocaltasks((prev) => {
          return prev?.map((t) => {
            if (t.id === active.id) return { ...t, status: "For Testing" };
            return t;
          });
        });
        await moveTaskMutation.mutateAsync({
          taskId: Number(active.id),
          status: "For Testing",
        });
      } else if (over.id === "finished-container") {
        if (finishedTasks?.some((d) => d.id === active.id)) return;
        setLocaltasks((prev) => {
          return prev?.map((t) => {
            if (t.id === active.id) return { ...t, status: "Finished" };
            return t;
          });
        });
        await moveTaskMutation.mutateAsync({
          taskId: Number(active.id),
          status: "Finished",
        });
      }
    }
    setActiveTask(undefined);
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const { active, over } = event;

    if (active) {
      setActiveTask({
        id: Number(active.id),
        title: active.data.current?.task.title,
      });
    }
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active) {
      setActiveTask({
        id: Number(active.id),
        title: active.data.current?.task.title,
      });
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragMove={handleDragMove}
      onDragStart={handleDragStart}
    >
      {isSuccess && (
        <div className="grid grid-cols-5 gap-4">
          <Droppable
            id={"backlog-container"}
            data={backlogTasks!}
            header="Backlogs"
          />
          <Droppable
            id={"inprogress-container"}
            data={inProgressTasks!}
            header="In Progress"
          />
          <Droppable
            id={"completed-container"}
            data={completedTasks!}
            header="Completed"
          />
          <Droppable
            id={"fortesting-container"}
            data={forTestingTasks!}
            header="For Testing"
          />
          <Droppable
            id={"finished-container"}
            data={finishedTasks!}
            header="Finished"
          />
          <DragOverlay
            dropAnimation={{
              duration: 200,
              easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
            }}
          >
            {activeTask && (
              <Draggable
                className="transform rotate-6"
                gripClassName="cursor-grabbing"
                data={activeTask!}
              />
            )}
          </DragOverlay>
        </div>
      )}
    </DndContext>
  );
}
