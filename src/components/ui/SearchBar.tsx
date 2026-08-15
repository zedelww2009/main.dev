"use client";

import { useState, type ChangeEvent } from "react";
import { HiOutlineSearch, HiOutlineX } from "react-icons/hi";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search projects...",
  className,
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div
      className={cn(
        "relative flex items-center w-full max-w-md",
        className
      )}
    >
      <motion.div
        animate={{
          boxShadow: isFocused
            ? "0 0 0 1px rgba(255,255,255,0.15)"
            : "0 0 0 1px transparent",
        }}
        className={cn(
          "flex items-center w-full h-10 rounded-[var(--radius-md)]",
          "bg-surface-2 border border-border",
          "transition-colors duration-150",
          isFocused && "border-neutral-500 bg-surface-3"
        )}
      >
        <span className="pl-3 text-muted-foreground">
          <HiOutlineSearch className="h-4 w-4" />
        </span>
        <input
          type="text"
          value={value}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="flex-1 bg-transparent border-none outline-none px-2.5 text-sm text-foreground placeholder:text-muted-foreground"
        />
        <AnimatePresence>
          {value && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              type="button"
              onClick={() => onChange("")}
              className="pr-3 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <HiOutlineX className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
