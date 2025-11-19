import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  useSensor,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Draggable from "@/components/page-components/root/draggable";
import Droppable from "@/components/page-components/root/droppable";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useGetProject, useGetTasks } from "@/api-hooks/queries";
import { useAssignTask, useMovePic, useMoveTask } from "@/api-hooks/mutations";
import DroppablePIC from "@/components/page-components/root/droppable-pic";
import SeatPlan from "@/components/page-components/root/seat-plan";
import type { TaskStatus } from "@/types/contants";
import { DataContext } from "@/context";
import { toast } from "sonner";
import { MyPointerSensor, type PIC, type Task } from "@/types";
import { formatDate } from "@/helpers";
import ProjectMembersDropdown from "@/components/page-components/root/project-members-dropdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Columns2,
  FoldVertical,
  Grid,
  Settings,
  UnfoldVertical,
} from "lucide-react";
import { ToggleGroup } from "@/components/ui/toggle-group";
import { Toggle } from "@/components/ui/toggle";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import UnassignedPic from "@/components/page-components/root/unassigned-pic";
import DraggableUnassignedPic from "@/components/page-components/root/draggable-unassigned-pic";

export const Route = createFileRoute("/$projectId/")({
  component: Index,
});

function Index() {
  const params = Route.useParams();

  // queries and state
  const { data: tasks, isSuccess: tasksIsSuccess } = useGetTasks(
    Number(params.projectId),
  );
  const { data: currentProject, isSuccess: currentProjectIsSuccess } =
    useGetProject(Number(params.projectId));
  const [activeItem, setActiveItem] = useState<
    | { id: number; task: Task }
    | { id: number; pic: PIC; type: "Assigned" | "Unassigned" }
  >();
  const {
    localTasks,
    setLocalTasks,
    setLocalPics,
    setUnassignedPics,
    unassignedPics,
    localPics,
  } = useContext(DataContext)!;
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [isGridView, setIsGridView] = useState<boolean>(false);

  // memoized variables
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
  const forRejectTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "Reject");
  }, [localTasks]);
  const finishedTasks = useMemo(() => {
    if (!localTasks || localTasks.length === 0) return undefined;
    return localTasks.filter((t) => t.status === "Finished");
  }, [localTasks]);

  const sensors = useSensor(MyPointerSensor, {
    activationConstraint: { distance: 1 },
  });

  // mutations
  const moveTaskMutation = useMoveTask();
  const movePicSeatMutation = useMovePic();
  const assignTaskMutation = useAssignTask();

  // side effects
  useEffect(() => {
    if (!tasksIsSuccess) return;
    setLocalTasks(tasks);
  }, [tasks, tasksIsSuccess]);

  // splitted functions
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

  // handlers
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
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
        } else if (over.id === "reject-container") {
          if (forRejectTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "Reject");
        } else if (over.id === "finished-container") {
          if (finishedTasks?.some((d) => d.id === active.id)) return;
          updateTaskStatus(active.id, "Finished");
        }
      } else if (String(over.id).includes("droppable-seat")) {
        if (String(active.id).includes("draggable-seat")) {
          toast.promise(
            movePicSeatMutation.mutateAsync({
              target: {
                picId: Number(over.data.current?.pic.id),
                seatTableId: Number(over.data.current?.pic.seatTableId),
              },
              current: {
                picId: Number(active.data.current?.pic.id),
                seatTableId: Number(active.data.current?.pic.seatTableId),
              },
              type: "move",
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
      } else if (String(over.id).includes("droppable-table")) {
        if (
          localPics &&
          localPics[Number(over.data.current?.table.id)]?.some(
            (p) => p.id === Number(active.data.current?.pic.id),
          )
        )
          return;
        // if (String(active.id).includes("draggable-unassigned")) {
        //   setUnassignedPics((prev) =>
        //     prev?.filter((p) => p.id !== active.data.current?.pic.id),
        //   );
        // }
        // setLocalPics((prev) => {
        //   let updatedNewTable = prev![Number(over.data.current?.table.id)];
        //   updatedNewTable?.push(active.data.current?.pic);
        //
        //   let updatedPrevTable =
        //     prev![Number(active.data.current?.seatTableId)];
        //   if (updatedPrevTable) {
        //     updatedPrevTable = updatedPrevTable.filter(
        //       (p) => p.id !== Number(active.data.current?.pic.id),
        //     );
        //     return {
        //       ...prev,
        //       [Number(over.data.current?.table.id)]: updatedNewTable!,
        //       [Number(active.data.current?.seatTableId)]: updatedPrevTable,
        //     };
        //   }
        //
        //   return {
        //     ...prev,
        //     [Number(over.data.current?.table.id)]: updatedNewTable!,
        //   };
        // });
        toast.promise(
          movePicSeatMutation.mutateAsync({
            current: {
              picId: Number(active.data.current?.pic.id),
              seatTableId: Number(over.data.current?.table.id),
            },
            type: "assign",
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
      } else if (String(over.id).includes("droppable-unassigned-table")) {
        if (
          unassignedPics?.some(
            (p) => p.id === Number(active.data.current?.pic.id),
          )
        )
          return;
        // setLocalPics((prev) => {
        //   const updated = prev![Number(over.data.current?.table.id)];
        //
        //   return {
        //     ...prev,
        //     [Number(over.data.current?.table.id)]: updated?.filter(
        //       (p) => p.id !== Number(active.data.current?.pic.id),
        //     )!,
        //   };
        // });
        // setUnassignedPics((prev) => {
        //   const updated = prev;
        //   updated?.push(active.data.current?.pic);
        //   return updated;
        // });
        toast.promise(
          movePicSeatMutation.mutateAsync({
            current: {
              picId: Number(active.data.current?.pic.id),
              seatTableId: Number(active.data.current?.pic.seatTableId),
            },
            type: "unassign",
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
      }
    }
    setActiveItem(undefined);
  }, []);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;

    if (active) {
      if (String(active.id).includes("draggable-seat")) {
        setActiveItem({
          id: Number(active.data.current?.pic.id),
          pic: active.data.current?.pic,
          type: "Assigned",
        });
      } else if (String(active.id).includes("draggable-unassigned")) {
        setActiveItem({
          id: Number(active.data.current?.pic.id),
          pic: active.data.current?.pic,
          type: "Unassigned",
        });
      } else {
        setActiveItem({
          id: Number(active.id),
          task: active.data.current?.task,
        });
      }
    }
  }, []);

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={[sensors]}
    >
      {currentProjectIsSuccess && (
        <div className="grid grid-cols-(--header-grid) gap-4">
          <div className="flex flex-col gap-2">
            {/* heading */}
            <p className="text-2xl font-bold text-primary">
              {currentProject.projectName}
            </p>
            {/* project description */}
            <p className="text-muted-foreground font-mono max-h-12 line-clamp-2 hover:line-clamp-none hover:max-h-52 transition-all duration-500">
              {currentProject.description}
            </p>
            {/* date created */}
            <p className="text-foreground font-mono">
              Date created: {formatDate(new Date(currentProject.createDate))}
            </p>
            <p className="text-foreground font-mono">
              Created by: {currentProject.createBy}
            </p>
          </div>
          <div className="w-full space-y-2">
            <ProjectMembersDropdown />
            <Button
              variant={"outline"}
              className="h-12 text-primary font-bold justify-start py-1 w-full"
            >
              <Settings />
              Project Settings
            </Button>
          </div>
        </div>
      )}
      <Separator orientation="horizontal" className="my-4" />
      <div>
        <div className="flex justify-end">
          <Toggle
            aria-label="Toggle Expand"
            size="lg"
            variant="outline"
            pressed={isGridView}
            className="rounded-none rounded-l-md"
            onPressedChange={setIsGridView}
          >
            {isGridView ? <Columns2 /> : <Grid />}
          </Toggle>
          <Toggle
            aria-label="Toggle Expand"
            size="lg"
            variant="outline"
            className="rounded-none rounded-r-md"
            pressed={isExpanded}
            onPressedChange={setIsExpanded}
          >
            {isExpanded ? <FoldVertical /> : <UnfoldVertical />}
          </Toggle>
        </div>
        {tasksIsSuccess && (
          <ScrollArea orientation="horizontal" className="w-full">
            <div
              className={cn(
                isGridView
                  ? "grid grid-cols-5 gap-2 space-y-4"
                  : "flex w-0 gap-4",
                "py-6",
              )}
            >
              <Droppable
                id={"backlog-container"}
                data={backlogTasks!}
                status="Backlog"
                isExpanded={isExpanded}
              />
              <Droppable
                id={"inprogress-container"}
                data={inProgressTasks!}
                status="In Progress"
                isExpanded={isExpanded}
              />
              <Droppable
                id={"completed-container"}
                data={completedTasks!}
                status="Completed"
                isExpanded={isExpanded}
              />
              <Droppable
                id={"fortesting-container"}
                data={forTestingTasks!}
                status="For Testing"
                isExpanded={isExpanded}
              />
              <Droppable
                id={"reject-container"}
                data={forRejectTasks!}
                status="Reject"
                isExpanded={isExpanded}
              />
              <Droppable
                id={"finished-container"}
                data={finishedTasks!}
                status="Finished"
                isExpanded={isExpanded}
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
                ) : activeItem?.type === "Assigned" ? (
                  <DroppablePIC
                    id={activeItem?.id.toString()!}
                    pic={activeItem?.pic}
                  />
                ) : (
                  <DraggableUnassignedPic
                    pic={activeItem?.pic}
                    dragId={activeItem?.id}
                  />
                )}
              </DragOverlay>
            </div>
          </ScrollArea>
        )}
        <div className="grid grid-cols-(--seat-plan-grid) mt-4 gap-4">
          <UnassignedPic />
          <SeatPlan />
        </div>
      </div>
    </DndContext>
  );
}
