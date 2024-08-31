import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export interface RefreshButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export function RefreshButton({
    onClick,
    disabled = false,
}: RefreshButtonProps) {
    const [rotation, setRotation] = useState(0);

    return (
        <Button
            variant="ghost"
            size="icon"
            disabled={disabled}
            onClick={(e) => {
                onClick && onClick(e);
                setRotation(rotation + 360);
            }}
        >
            <RefreshCw
                className="h-[1.2rem] w-[1.2rem] transition-transform duration-500"
                style={{ transform: `rotate(${rotation.toString()}deg)` }}
            />
        </Button>
    );
}
