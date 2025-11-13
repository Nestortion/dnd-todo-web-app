import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPicList } from "@/api-hooks/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import DroppableTable from "./droppable-table";
import { DataContext } from "@/context";

const SeatPlan = () => {
  const { data: picList, isSuccess } = useGetPicList();
  const { localPics, setLocalPics } = useContext(DataContext)!;

  const picTables = useMemo(() => {
    if (!localPics || localPics.length === 0) return undefined;
    const tables = Array.from(
      new Set(localPics.flatMap((p) => p.tableId)),
    ).sort();

    return tables.map((t) => ({
      tableId: t,
      list: localPics
        .filter((p) => p.tableId === t)
        .sort((a, b) => a.seatNumber - b.seatNumber),
    }));
  }, [localPics]);

  useEffect(() => {
    if (!isSuccess) return;
    setLocalPics(picList);
  }, [picList, isSuccess]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seat Arrangement </CardTitle>
        <CardDescription>Drag and drop a task to pic to assign</CardDescription>
      </CardHeader>
      <CardContent className="bg-background mx-6 py-6 grid grid-cols-2 gap-16">
        {isSuccess &&
          picTables?.map((pt, index) => {
            return (
              <DroppableTable
                key={index}
                data={pt.list!}
                id={String(pt.tableId)}
              />
            );
          })}
      </CardContent>
    </Card>
  );
};

export default SeatPlan;
