import { useEffect } from "react";

export const useKeyboardShortcut = (
  keys: string[],
  callback: () => void
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const keyMatch = keys.every((key) => {
        switch (key) {
          case "ctrl":
            return event.ctrlKey;
          case "shift":
            return event.shiftKey;
          case "alt":
            return event.altKey;
          case "cmd":
            return event.metaKey; // cmd key (metaKey)
          default:
            return event.key.toLowerCase() === key; // Match custom string keys
        }
      });

      if (keyMatch) {
        callback();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [keys, callback]);
};
