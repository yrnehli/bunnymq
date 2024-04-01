import { Ping } from "@/components/Ping";
import { RefreshButton } from "@/components/RefreshButton";
import { Spinner } from "@/components/Spinner";
import { useTheme } from "@/components/ThemeProvider";
import { TooltipBasic } from "@/components/TooltipBasic";
import { QueueSkeleton } from "@/components/skeletons/QueueSkeleton";
import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import * as api from "@/lib/api";
import { cn } from "@/lib/utils";
import { checkAuthenticated } from "@/routes/__root";
import Editor from "@monaco-editor/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import dedent from "dedent";
import { OctagonX, Search } from "lucide-react";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { vs, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
SyntaxHighlighter.registerLanguage("json", json);

export const Route = createFileRoute("/queues/$queueId")({
    component: Queue,
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

const DEFAULT_CODE = dedent`
    const pprint = (obj) => JSON.stringify(obj, null, 4);

    const message = "foo";
    const payload = "bar";

    // Return a string to publish to the queue
    return pprint([message, payload]);
`;

const computeCode = (code: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const res: unknown = new Function(code)();
        return typeof res === "string" ? res.trim() : null;
    } catch (e) {
        return null;
    }
};

function Queue() {
    const { appearance } = useTheme();
    const { queueId } = useParams({ from: "/queues/$queueId" });
    const [code, setCode] = useState(DEFAULT_CODE);
    const [refresh, setRefresh] = useState(false);
    const queryClient = useQueryClient();
    const output = computeCode(code);
    const queryKeys = {
        queue: ["queue", queueId],
        messages: ["messages", queueId],
    } as const;

    const { data: queue } = useQuery({
        queryKey: queryKeys.queue,
        queryFn: () => api.queue(queueId),
    });

    const { data: messages } = useQuery({
        queryKey: queryKeys.messages,
        queryFn: () => api.messages(queueId),
    });

    const publishMessage = useMutation({
        mutationFn: (message: string) => api.publish(queueId, message),
        onSuccess: () => toast("Successfully published message ✅"),
        onError: () => toast("Failed to publish message ⛔"),
    });

    if (!queue || !messages) {
        return <QueueSkeleton />;
    }

    return (
        <div className="grid gap-y-8">
            <div className="grid grid-cols-12 items-center justify-between">
                <div className="col-span-12 md:col-span-10">
                    <h1 className="mb-2 max-w-xs truncate text-lg font-bold sm:text-2xl md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
                        {queueId}
                    </h1>
                    <QueueInfo queue={queue} />
                </div>
                <div className="col-span-12 mt-1 flex md:col-span-2 md:mt-0 md:justify-end">
                    <TooltipBasic
                        message="Purge Messages"
                        className="text-red-500"
                    >
                        <Button variant="ghost" size="icon">
                            <OctagonX className="h-[1.2rem] w-[1.2rem] text-red-500" />
                        </Button>
                    </TooltipBasic>
                    <ViewMessages queue={queue} />
                    <RefreshButton
                        onClick={() => {
                            queryClient.removeQueries({
                                queryKey: queryKeys.queue,
                            });
                            queryClient.removeQueries({
                                queryKey: queryKeys.messages,
                            });
                            setRefresh(!refresh);
                        }}
                    />
                </div>
            </div>
            <div>
                <div className="mb-1 text-lg font-medium">
                    Construct Message 🚧
                </div>
                <Editor
                    height="400px"
                    className="max-w-full border"
                    theme={appearance === "dark" ? "vs-dark" : "light"}
                    defaultLanguage="javascript"
                    defaultValue={code}
                    onChange={(value) => value && setCode(value)}
                    options={{
                        minimap: { enabled: false },
                        scrollbar: { vertical: "hidden" },
                        hideCursorInOverviewRuler: true,
                        overviewRulerBorder: false,
                        automaticLayout: true,
                    }}
                />
            </div>
            <div>
                <div className="mb-1 text-lg font-medium">
                    Message Preview 💬
                </div>
                {output ? (
                    <SyntaxHighlighter
                        language="json"
                        style={appearance === "dark" ? vs2015 : vs}
                    >
                        {output}
                    </SyntaxHighlighter>
                ) : (
                    <div className="text-red-600">
                        Invalid message construction, expected a string to be
                        returned!
                    </div>
                )}
            </div>
            <div>
                <Button
                    disabled={output === null || publishMessage.isPending}
                    onClick={() => output && publishMessage.mutate(output)}
                >
                    {publishMessage.isPending && <Spinner />}
                    Publish Message
                </Button>
            </div>
        </div>
    );
}

type QueueInfoProps = {
    queue: api.Queue;
};

function QueueInfo({ queue }: QueueInfoProps) {
    return (
        <div className="flex flex-col gap-x-8 sm:flex-row">
            <div className="flex flex-row items-center gap-x-3">
                <Ping variant={queue.consumers > 0 ? "green" : "red"} />
                <small>
                    <span className="font-bold">{queue.consumers}</span>{" "}
                    {queue.consumers === 1 ? "consumer" : "consumers"}
                </small>
            </div>
            <div className="flex flex-row items-center gap-x-3">
                <Ping variant={queue.ready > 0 ? "amber" : "green"} />
                <small>
                    <span className="font-bold">{queue.ready}</span>{" "}
                    {queue.ready === 1 ? "message" : "messages"} ready
                </small>
            </div>
            <div className="flex flex-row items-center gap-x-3">
                <Ping variant={queue.unacked > 0 ? "red" : "green"} />
                <small>
                    <span className="font-bold">{queue.unacked}</span>{" "}
                    {queue.unacked === 1 ? "message" : "messages"}{" "}
                    unacknowledged
                </small>
            </div>
        </div>
    );
}

type ViewMessagesProps = {
    queue: api.Queue;
};

function ViewMessages({ queue }: ViewMessagesProps) {
    const messagesCount = Math.min(10, queue.total);
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
            <SheetContent className="max-w-3/4 sm:max-w-3/4 w-3/4 md:w-1/2">
                <SheetHeader>
                    <SheetTitle>Messages</SheetTitle>
                    <SheetDescription>
                        Displaying the latest {!singleMessage && messagesCount}{" "}
                        {singleMessage ? "message" : "messages"} of{" "}
                        <span className="italic">{queue.name}</span>.
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    );
}
