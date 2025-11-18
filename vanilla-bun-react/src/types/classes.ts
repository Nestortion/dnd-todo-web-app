import { PointerSensor } from "@dnd-kit/core";

export class MyPointerSensor extends PointerSensor {
  static override activators = [
    {
      eventName: "onPointerDown" as const,
      handler: ({ nativeEvent }: React.PointerEvent) => {
        if (!nativeEvent.isPrimary || nativeEvent.button !== 0) {
          return false;
        }

        if (
          (nativeEvent.target as any).getAttribute("data-slot") ===
          "dialog-overlay"
        ) {
          // don't allow drag/drop of elements behind the dialog
          return false;
        }

        return true;
      },
    },
  ];
}
