"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import ResizeObserver from "resize-observer-polyfill";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { type TagOption } from "@/types/Tags";

interface MultiSelectorProps {
  options: TagOption[];
  selected: TagOption[];
  onSelectedChange: (selected: TagOption[]) => void;
  placeholder?: string;
  singleSelect?: boolean; // New prop: single-select mode
  inputPlaceholder?: string; // New prop: custom input placeholder
}

export function MultiSelector({
  options = [], // Default empty array to prevent `undefined`
  selected,
  onSelectedChange,
  placeholder = "Select relevant tags...",
  singleSelect = false,
  inputPlaceholder = "Search options...", // Default value for new prop
}: MultiSelectorProps) {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [maxVisibleTags, setMaxVisibleTags] = useState<number>(3);
  const containerRef = useRef<HTMLDivElement>(null);

  // Filter options based on search term
  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Reset search term when the popover closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("");
    }
  }, [open]);

  // Handle selection
  const handleSelect = (option: TagOption) => {
    if (singleSelect) {
      // For single-select, replace the selected option
      onSelectedChange([option]);
    } else {
      if (selected.find((item) => item.value === option.value)) {
        // If already selected, remove it
        onSelectedChange(
          selected.filter((item) => item.value !== option.value)
        );
      } else {
        // Else, add it
        onSelectedChange([...selected, option]);
      }
    }
  };

  // Adjust maxVisibleTags dynamically
  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const calculateMaxVisibleTags = () => {
      const containerWidth = container.offsetWidth;
      const tagWidth = 80;
      const chevronWidth = 24;
      const padding = 16;

      const availableWidth = containerWidth - chevronWidth - padding;
      setMaxVisibleTags(Math.max(1, Math.floor(availableWidth / tagWidth)));
    };

    const resizeObserver = new ResizeObserver(() => {
      calculateMaxVisibleTags();
    });

    resizeObserver.observe(container);
    calculateMaxVisibleTags();

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={false}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-full justify-between gap-1 overflow-hidden border"
        >
          <div
            ref={containerRef}
            className="flex flex-1 items-center gap-1 overflow-hidden"
          >
            {selected.length > 0 ? (
              <>
                {selected.slice(0, maxVisibleTags).map((tag) => (
                  <span
                    key={tag.value}
                    className="px-1 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-xs font-medium flex-shrink-0"
                  >
                    {tag.label}
                  </span>
                ))}
                {selected.length > maxVisibleTags && (
                  <span className="font-body text-p13 flex-shrink-0">
                    +{selected.length - maxVisibleTags} more
                  </span>
                )}
              </>
            ) : (
              <span className="font-body text-p13 text-muted-foreground truncate">
                {placeholder}
              </span>
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-full p-0 z-50"
        side="bottom"
        align="start"
        sideOffset={4}
        avoidCollisions={true}
        collisionPadding={10}
      >
        <Command>
          <CommandInput
            placeholder={inputPlaceholder} // Use inputPlaceholder prop
            value={searchTerm}
            onValueChange={(value) => {
              setSearchTerm(value);
            }}
          />
          <CommandList>
            {filteredOptions.length === 0 && searchTerm !== "" ? (
              <CommandEmpty>No options found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selected.find((item) => item.value === option.value)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
          <div className="p-2" />
        </Command>
      </PopoverContent>
    </Popover>
  );
}
