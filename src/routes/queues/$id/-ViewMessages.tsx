import { Copy, Search } from "lucide-react";
import { toast } from "sonner";
import { useCopyToClipboard } from "usehooks-ts";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";
import { TooltipBasic } from "@/components/TooltipBasic";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Queue } from "@/lib/api";
import { cn } from "@/lib/utils";

export type ViewMessagesProps = {
    queue: Queue;
    messages: string[];
};

export function ViewMessages({ queue, messages }: ViewMessagesProps) {
    const [, copy] = useCopyToClipboard();
    const messagesCount = Math.min(10, messages.length);
    const singleMessage = messagesCount === 1;

    return (
        <Sheet>
            <SheetTrigger>
                <TooltipBasic message="View Messages">
                    <div
                        className={cn(
                            "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                            "h-10 w-10 hover:bg-accent hover:text-accent-foreground",
                        )}
                    >
                        <Search className="h-[1.2rem] w-[1.2rem]" />
                    </div>
                </TooltipBasic>
            </SheetTrigger>
            <SheetContent className="w-full max-w-full overflow-y-scroll sm:max-w-full lg:w-3/4 2xl:w-1/2">
                <SheetHeader className="mb-3">
                    <SheetTitle>Messages</SheetTitle>
                    <SheetDescription>
                        Displaying the first{" "}
                        <span className="font-bold">
                            {!singleMessage && messagesCount}
                        </span>{" "}
                        {singleMessage ? "message" : "messages"} of{" "}
                        <span className="italic">{queue.name}</span>.
                    </SheetDescription>
                </SheetHeader>
                {messages.map((message, i) => (
                    <div key={i} className={cn("py-3", i > 0 && "border-t")}>
                        <div className="mb-1 flex items-center">
                            <small className="mr-2 uppercase opacity-60">
                                Message {i + 1}
                            </small>
                            <button
                                onClick={() => {
                                    void copy(message);
                                    toast("Copied to clipboard 📋");
                                }}
                            >
                                <Copy className="h-[12px] w-[12px]" />
                            </button>
                        </div>
                        <SyntaxHighlighter>{message}</SyntaxHighlighter>
                    </div>
                ))}
            </SheetContent>
        </Sheet>
    );
}
