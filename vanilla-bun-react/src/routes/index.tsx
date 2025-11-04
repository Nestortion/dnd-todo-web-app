import { createFileRoute } from "@tanstack/react-router";
import {
  DndContext,
  DragOverlay,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Draggable from "@/components/page-components/root/draggable";
import Droppable from "@/components/page-components/root/droppable";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const [data, setData] = useState<
    Array<{ id: string; parentContainer?: string | number }>
  >([
    { id: "Ni hao" },
    { id: "Dhokla" },
    { id: "here" },
    { id: "Its me" },
    { id: "Batman" },
    { id: "hehe xd" },
    { id: "Ohayou" },
    // { id: "Gozaimasu" },
    // { id: "Kyou wa" },
    // { id: "Meccha Samui" },
    // { id: "Atode" },
    // { id: "Tori ryori shimasu" },
  ]);
  const [containerData, setContainerData] = useState<
    Record<string, Array<string>>
  >({ "drop-container1": [], "drop-container2": [] });
  const [activeId, setActiveId] = useState<string | number>();

  const handleDragEnd = (event: DragEndEvent) => {
    const { over, active } = event;

    if (over) {
      if (over.id === "drop-container1") {
        if (containerData["drop-container1"]?.some((d) => d === active.id))
          return;
        setContainerData((prev) => {
          let newData = [...prev["drop-container1"], active.id];
          if (prev["drop-container1"]?.some((d) => d === active.id))
            return prev;
          return {
            ...prev,
            "drop-container1": newData,
          };
        });
        if (data.length > 0) {
          setData((prev) => prev.filter((d) => d.id !== active.id));
        }
        if (containerData["drop-container2"]!.length > 0) {
          setContainerData((prev) => ({
            ...prev,
            "drop-container2": prev["drop-container2"]!.filter(
              (d) => d !== active.id,
            ),
          }));
        }
      } else if (over.id === "drop-container2") {
        if (containerData["drop-container2"]?.some((d) => d === active.id))
          return;
        setContainerData((prev) => {
          let newData = [...prev["drop-container2"], active.id];
          return {
            ...prev,
            "drop-container2": newData,
          };
        });
        if (data.length > 0) {
          setData((prev) => prev.filter((d) => d.id !== active.id));
        }
        if (containerData["drop-container1"]!.length > 0) {
          setContainerData((prev) => ({
            ...prev,
            "drop-container1": prev["drop-container1"]!.filter(
              (d) => d !== active.id,
            ),
          }));
        }
      }
    } else {
      if (active.data.current?.parentContainer === "drop-container1") {
        setData((prev) =>
          prev.some((d) => d.id === active.id)
            ? prev
            : [...prev, { id: active.id as string }],
        );
        if (containerData["drop-container1"]!.length > 0) {
          setContainerData((prev) => ({
            ...prev,
            "drop-container1": prev["drop-container1"]!.filter(
              (d) => d !== active.id,
            ),
          }));
        }
      } else if (active.data.current?.parentContainer === "drop-container2") {
        setData((prev) =>
          prev.some((d) => d.id === active.id)
            ? prev
            : [...prev, { id: active.id as string }],
        );
        if (containerData["drop-container2"]!.length > 0) {
          setContainerData((prev) => ({
            ...prev,
            "drop-container2": prev["drop-container2"]!.filter(
              (d) => d !== active.id,
            ),
          }));
        }
      }
    }
    setActiveId(undefined);
    return;
  };

  // const handleDragMove = (event: DragMoveEvent) => {
  //   const { active, over } = event;
  //
  //   if (active) {
  //     setActiveId(active.id);
  //   }
  // };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;

    if (active) {
      setActiveId(active.id);
    }
    console.log("testx");
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      // onDragMove={handleDragMove}
      onDragStart={handleDragStart}
    >
      {data.map((d, index) => (
        <Draggable parentContainer={d.parentContainer} id={d.id} key={index} />
      ))}

      <div className="grid grid-cols-2">
        <Droppable
          data={containerData["drop-container1"]!}
          id={"drop-container1"}
        />
        <Droppable
          id={"drop-container2"}
          data={containerData["drop-container2"]!}
        />
        <DragOverlay
          dropAnimation={{
            duration: 200,
            easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
          }}
        >
          {activeId && (
            <Draggable
              className="transform rotate-6"
              gripClassName="cursor-grabbing"
              id={activeId}
            />
          )}
        </DragOverlay>
      </div>
    </DndContext>
  );
}
