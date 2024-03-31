import { cn } from "@/lib/utils";

export type PingProps = {
    variant: "green" | "amber" | "red";
};

export function Ping({ variant }: PingProps) {
    return (
        <span className="relative flex h-2 w-2">
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
