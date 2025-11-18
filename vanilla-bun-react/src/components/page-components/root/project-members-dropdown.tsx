import { useGetPicList } from "@/api-hooks/queries";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { useParams } from "@tanstack/react-router";
import { Users } from "lucide-react";

const ProjectMembersDropdown = () => {
  const params = useParams({ from: "/$projectId/" });
  const { data: picList, isSuccess: picListIsSuccess } = useGetPicList({
    projectId: Number(params.projectId),
  });
  return (
    <Button variant={"outline"} className="h-fit justify-start py-1 w-full">
      {picListIsSuccess && (
        <>
          <div className="flex gap-2 items-center py-2 hover:cursor-pointer">
            <Users className="text-primary" strokeWidth={3} />
            <p className="font-bold text-primary">Manage Members</p>
            <div className="flex -space-x-2">
              {picList.slice(0, 3).map((p, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Avatar
                      className={cn(
                        "hover:-translate-y-3",
                        "transition-transform duration-300",
                        "ring-primary ring-2",
                        index === 0 ? `z-2` : index === 1 ? `z-1` : `z-0`,
                      )}
                    >
                      <AvatarImage src={p.profileImage} alt="" />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>{p.name}</TooltipContent>
                </Tooltip>
              ))}
            </div>

            {picList.length > 3 && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex gap-1 items-center text-primary font-bold">
                    <p className="font-bold">+{picList.length - 3}</p>
                  </div>
                </TooltipTrigger>
                <TooltipContent>{picList.length} members</TooltipContent>
              </Tooltip>
            )}
          </div>
        </>
      )}
    </Button>
  );
};

export default ProjectMembersDropdown;
