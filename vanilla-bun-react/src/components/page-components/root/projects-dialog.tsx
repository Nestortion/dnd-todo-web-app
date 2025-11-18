import { useGetProjects } from "@/api-hooks/queries";
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
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useNavigate } from "@tanstack/react-router";
import { CornerDownRight, FolderPlus, SearchIcon } from "lucide-react";
import { useState, type FC } from "react";
import CreateProjectDialog from "./create-project-dialog";

const ProjectsDialog: FC = () => {
  const navigate = useNavigate();
  const [projectSearch, setProjectSearch] = useState<string>("");
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const { data: projects, isSuccess } = useGetProjects();
  return (
    <Dialog open={openDialog} onOpenChange={setOpenDialog}>
      <DialogTrigger asChild>
        <Button variant={"ghost"} className="font-medium text-xl">
          Projects
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex-row gap-2 items-center">
          <DialogTitle>Project List</DialogTitle>
          <CreateProjectDialog setParentOpen={setOpenDialog} />
        </DialogHeader>
        <DialogDescription aria-hidden hidden />
        <div className="flex flex-col">
          {isSuccess &&
            projects
              .filter((p) =>
                p.projectName
                  .trim()
                  .toLowerCase()
                  .includes(projectSearch.toLowerCase()),
              )
              .map((p, index) => (
                <div
                  key={index}
                  className="p-2 hover:bg-foreground/5 hover:cursor-pointer transition-all duration-300 rounded-md flex gap-2"
                  onClick={() => {
                    navigate({
                      to: "/$projectId",
                      params: { projectId: String(p.id) },
                    });
                    setOpenDialog(false);
                  }}
                >
                  <CornerDownRight />
                  {p.projectName}
                </div>
              ))}
        </div>
        <DialogFooter>
          <InputGroup>
            <InputGroupInput
              placeholder="Search Projects..."
              onChange={(e) => setProjectSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectsDialog;
