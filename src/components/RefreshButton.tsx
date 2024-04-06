import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

export type RefreshButtonProps = {
    onClick?: () => void;
    disabled?: boolean;
};

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
            onClick={() => {
                onClick && onClick();
                setRotation(rotation + 360);
            }}
        >
            <RefreshCw
                className="h-[1.2rem] w-[1.2rem] transition-transform duration-500"
                style={{ transform: `rotate(${rotation}deg)` }}
            />
        </Button>
    );
}
