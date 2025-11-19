import type { PIC, Task } from "@/types";
import {
  createContext,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";

type ContextType = {
  localTasks?: Array<Task>;
  localPics?: Record<number, Array<PIC>>;
  unassignedPics?: Array<PIC>;
  setLocalTasks: Dispatch<SetStateAction<Array<Task> | undefined>>;
  setLocalPics: Dispatch<
    SetStateAction<Record<number, Array<PIC>> | undefined>
  >;
  setUnassignedPics: Dispatch<SetStateAction<Array<PIC> | undefined>>;
};
export const DataContext = createContext<ContextType | undefined>(undefined);

export const DataContextWrapper = ({ children }: { children?: ReactNode }) => {
  const [localTasks, setLocalTasks] = useState<Array<Task>>();
  const [localPics, setLocalPics] = useState<Record<number, Array<PIC>>>();
  const [unassignedPics, setUnassignedPics] = useState<Array<PIC>>();

  return (
    <DataContext
      value={{
        localTasks,
        setLocalTasks,
        localPics,
        setLocalPics,
        unassignedPics,
        setUnassignedPics,
      }}
    >
      {children}
    </DataContext>
  );
};
