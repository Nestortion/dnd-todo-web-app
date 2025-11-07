import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { ReactElement } from "react";

type Props = {
  className: string;
  title: string;
  description: string;
  icon: ReactElement;
};

const EmptyComponent = ({ className, title, description, icon }: Props) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle className="text-primary">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
};

export default EmptyComponent;
