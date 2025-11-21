import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetSeatTables } from "@/api-hooks/queries";
import SeatTable from "./seat-table";
import { useParams } from "@tanstack/react-router";
import EmptyComponent from "@/components/state-components/empty";
import { Grid2x2Plus, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import CreateTableDialog from "./create-table-dialog";
import { memo, useState, type FC } from "react";
import { Button } from "@/components/ui/button";
import type { PIC } from "@/types";

const SeatPlan: FC<{ tablePics: Record<number, Array<PIC>> }> = memo(
  ({ tablePics }) => {
    const [openCreateTable, setOpenCreateTable] = useState<boolean>(false);
    const params = useParams({ from: "/$projectId/" });
    const { data: seatTables, isSuccess: seatTablesSuccess } = useGetSeatTables(
      Number(params.projectId),
    );

    return (
      <Card>
        <CardHeader className="flex justify-between w-full">
          <div>
            <CardTitle>Seat Arrangement </CardTitle>
            <CardDescription>
              Drag and drop a task to pic to assign
            </CardDescription>
          </div>
          <CreateTableDialog
            open={openCreateTable}
            setOpen={setOpenCreateTable}
            trigger={
              <Button variant={"ghost"}>
                <Grid2x2Plus className="hover:cursor-pointer" />
              </Button>
            }
          />
        </CardHeader>
        <CardContent
          className={cn(
            "bg-background mx-6 py-6 gap-16",
            seatTablesSuccess && seatTables.length > 0 && "grid grid-cols-2 ",
          )}
        >
          {seatTablesSuccess && seatTables.length > 0 ? (
            seatTables?.map((st, index) => {
              return (
                <SeatTable
                  key={index}
                  data={st}
                  picList={tablePics[st.id] ?? []}
                />
              );
            })
          ) : (
            <EmptyComponent
              icon={<Users />}
              description="It looks like this project does not have any tables yet"
              title="No Tables Found"
              content={
                <CreateTableDialog
                  open={openCreateTable}
                  setOpen={setOpenCreateTable}
                />
              }
            />
          )}
        </CardContent>
      </Card>
    );
  },
);

export default SeatPlan;
