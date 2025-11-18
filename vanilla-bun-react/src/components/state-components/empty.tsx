import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { ReactElement, ReactNode } from "react";

type Props = {
  className?: string;
  title: string;
  description: string;
  icon: ReactElement;
  content?: ReactNode;
};

const EmptyComponent = ({
  className,
  title,
  description,
  icon,
  content,
}: Props) => {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon}</EmptyMedia>
        <EmptyTitle className="text-primary">{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {content && <EmptyContent>{content}</EmptyContent>}
    </Empty>
  );
};

export default EmptyComponent;
