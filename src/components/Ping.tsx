import React from "react";
import { cn } from "@/lib/utils";

export interface PingProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant: "green" | "amber" | "red";
}

export function Ping({ variant, className, ...props }: PingProps) {
    return (
        <span className={cn("relative flex h-2 w-2", className)} {...props}>
            <span
                className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    {
                        "green": "bg-green-500",
                        "amber": "bg-amber-500",
                        "red": "bg-red-500",
                    }[variant],
                )}
            />
            <span
                className={cn(
                    "relative inline-flex h-2 w-2 rounded-full",
                    {
                        "green": "bg-green-600",
                        "amber": "bg-amber-600",
                        "red": "bg-red-600",
                    }[variant],
                )}
            />
        </span>
    );
}
