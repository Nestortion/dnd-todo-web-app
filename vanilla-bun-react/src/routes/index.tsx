import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Draggable from "@/components/page-components/root/draggable";
import Droppable from "@/components/page-components/root/droppable";
import { useContext, useEffect, useMemo, useState } from "react";
import { useGetTasks } from "@/api-hooks/queries";
import { useAssignTask, useMovePic, useMoveTask } from "@/api-hooks/mutations";
import DroppablePIC from "@/components/page-components/root/droppable-pic";
import SeatPlan from "@/components/page-components/root/seat-plan";
import type { TaskStatus } from "@/types/contants";
import { DataContext } from "@/context";
import { toast } from "sonner";
import type { PIC, Task } from "@/types";

export const Route = createFileRoute("/")({
  component: Index,
});
class MyPointerSensor extends PointerSensor {
  static override activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: React.PointerEvent) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false;
        }

        if (nativeEvent.target.getAttribute("data-slot") === "dialog-overlay") {
          // don't allow drag/drop of elements behind the dialog
          return false;
        }

        return true;
      },
    },
  ];
}
function Index() {
  const { data, isSuccess } = useGetTasks();
  const [activeItem, setActiveItem] = useState<
    { id: number; task: Task } | { id: number; pic: PIC }
  >();

  const { localTasks, setLocalTasks, localPics, setLocalPics } =
    useContext(DataContext)!;

  const moveTaskMutation = useMoveTask();
  const movePicSeatMutation = useMovePic();
  const assignTaskMutation = useAssignTask();

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

  const sensors = useSensor(MyPointerSensor, {
    activationConstraint: { distance: 1 },
  });

  useEffect(() => {
    if (!isSuccess) return;
    setLocalTasks(data.tasks);
  }, [data, isSuccess]);

  const updateTaskStatus = async (
    activeId: string | number,
    status: TaskStatus,
  ) => {
    setLocalTasks((prev) => {
      return prev?.map((t) => {
        if (t.id === activeId) return { ...t, status };
        return t;
      });
    });
    toast.promise(
      moveTaskMutation.mutateAsync({
        taskId: Number(activeId),
        status,
      }),
      {
        loading: "Moving task...",
        success: (data) => {
          return data.message;
        },
        error: (error) => {
          return error.message;
        },
      },
    );
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { over, active } = event;

    if (over) {
      if (
        String(over.id).includes("container") &&
        active?.data.current?.type === "draggable-task"
      ) {
        if (over.id === "backlog-container") {
          if (backlogTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "Backlog");
        } else if (over.id === "inprogress-container") {
          if (inProgressTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "In Progress");
        } else if (over.id === "completed-container") {
          if (completedTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "Completed");
        } else if (over.id === "fortesting-container") {
          if (forTestingTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "For Testing");
        } else if (over.id === "finished-container") {
          if (finishedTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "Finished");
        }
      } else if (String(over.id).includes("droppable-seat")) {
        if (String(active.id).includes("draggable-seat")) {
          setLocalPics((prev) => {
            if (!prev) return undefined;
            const selectedPic = prev?.find(
              (p) => p.id === Number(active.data.current?.pic.id),
            )!;
            const targetPic = prev?.find(
              (p) => p.id === Number(over.data.current?.pic.id),
            )!;

            const newPic = prev?.map((pic) => {
              if (pic.id === selectedPic?.id)
                return {
                  ...selectedPic,
                  id: targetPic.id,
                  name: targetPic.name,
                };
              if (pic.id === targetPic?.id)
                return {
                  ...targetPic,
                  id: selectedPic.id,
                  name: selectedPic.name,
                };

              return pic;
            });

            return newPic;
          });
          toast.promise(
            movePicSeatMutation.mutateAsync({
              targetPicId: Number(over.data.current?.pic.id),
              selectedPicId: Number(active.data.current?.pic.id),
            }),
            {
              loading: "Moving seat...",
              success: (data) => {
                return data.message;
              },
              error: (error) => {
                return error.message;
              },
            },
          );
        } else if (active?.data.current?.type === "draggable-task") {
          toast.promise(
            assignTaskMutation.mutateAsync({
              taskId: Number(active.data.current?.task.id),
              picId: Number(over.data.current?.pic.id),
            }),
            {
              loading: "Assigning task...",
              success: (data) => {
                return data.message;
              },
              error: (error) => {
                return error.message;
              },
            },
          );
        }
      }
    }
    setActiveItem(undefined);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active) {
      if (String(active.id).includes("draggable-seat")) {
        setActiveItem({
          id: Number(active.data.current?.pic.id),
          pic: active.data.current?.pic,
        });
      } else {
        setActiveItem({
          id: Number(active.id),
          task: active.data.current?.task,
        });
      }
    }
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={[sensors]}
    >
      <div className="space-y-4">
        <div>
          {isSuccess && (
            <div className="grid grid-cols-5 gap-4">
              <Droppable
                id={"backlog-container"}
                data={backlogTasks!}
                status="Backlog"
              />
              <Droppable
                id={"inprogress-container"}
                data={inProgressTasks!}
                status="In Progress"
              />
              <Droppable
                id={"completed-container"}
                data={completedTasks!}
                status="Completed"
              />
              <Droppable
                id={"fortesting-container"}
                data={forTestingTasks!}
                status="For Testing"
              />
              <Droppable
                id={"finished-container"}
                data={finishedTasks!}
                status="Finished"
              />
              <DragOverlay
                dropAnimation={{
                  duration: 200,
                  easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
                }}
              >
                {activeItem && "task" in activeItem ? (
                  <Draggable
                    className="transform rotate-6 opacity-70"
                    data={activeItem.task}
                  />
                ) : (
                  <DroppablePIC
                    id={activeItem?.id.toString()!}
                    pic={activeItem?.pic}
                  />
                )}
              </DragOverlay>
            </div>
          )}
        </div>
        <div className="">
          <SeatPlan />
        </div>
      </div>
    </DndContext>
  );
}
