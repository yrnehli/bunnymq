import { Ping } from "@/components/Ping";
import { RefreshButton } from "@/components/RefreshButton";
import { Spinner } from "@/components/Spinner";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";
import { useTheme } from "@/components/ThemeProvider";
import { TooltipBasic } from "@/components/TooltipBasic";
import { QueueSkeleton } from "@/components/skeletons/QueueSkeleton";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { Copy, OctagonX, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import ts from "typescript";
import { useCopyToClipboard } from "usehooks-ts";

export const Route = createFileRoute("/queues/$queueId")({
    component: Queue,
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

const DEFAULT_CODE = dedent`
    const pprint = (obj: object) => JSON.stringify(obj, null, 4);

    const message = "foo";
    const payload = "bar";

    // @ts-ignore: Return a string to publish to the queue
    return pprint([message, payload]);
`;

const computeCode = (code: string) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const res: unknown = new Function(ts.transpile(code))();
        return typeof res === "string" ? res.trim() : null;
    } catch (e) {
        return null;
    }
};

function Queue() {
    const { appearance } = useTheme();
    const { queueId } = useParams({ from: "/queues/$queueId" });
    const [code, setCode] = useState(DEFAULT_CODE);
    const environment = api.getEnvironment();
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

    const invalidateQueries = () => {
        void queryClient.invalidateQueries({
            queryKey: queryKeys.queue,
        });
        void queryClient.invalidateQueries({
            queryKey: queryKeys.messages,
        });
    };

    const publishMessage = useMutation({
        mutationFn: (message: string) => api.publish(queueId, message),
        onSuccess: () => {
            toast("Successfully published message ✅");
            invalidateQueries();
        },
        onError: () => toast("Failed to publish message ⛔"),
    });

    if (!queue || !messages) {
        return <QueueSkeleton />;
    }

    return (
        <div className="flex flex-col gap-y-8">
            <div className="grid grid-cols-12 items-center justify-between">
                <div className="col-span-12 md:col-span-10">
                    <h1 className="mb-2 max-w-xs truncate text-lg font-bold sm:text-2xl md:max-w-sm lg:max-w-md xl:max-w-lg 2xl:max-w-xl">
                        {queueId}
                    </h1>
                    <QueueInfo queue={queue} />
                </div>
                <div className="col-span-12 mt-1 flex md:col-span-2 md:mt-0 md:justify-end">
                    <PurgeMessages
                        queue={queue}
                        onPurge={() => invalidateQueries()}
                    />
                    <ViewMessages queue={queue} messages={messages} />
                    <RefreshButton onClick={() => invalidateQueries()} />
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
                    defaultLanguage="typescript"
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
                    <SyntaxHighlighter>{output}</SyntaxHighlighter>
                ) : (
                    <div className="text-red-600">
                        Invalid message construction, expected a string to be
                        returned!
                    </div>
                )}
            </div>
            <div>
                {["prod", "production"].includes(environment) && (
                    <div className="mb-3 text-red-600">
                        <span className="font-bold">Warning</span>: you are
                        publishing this message to a{" "}
                        <span className="font-bold">production</span>{" "}
                        environment!
                    </div>
                )}
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
    messages: string[];
};

function ViewMessages({ queue, messages }: ViewMessagesProps) {
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
            <SheetContent className="w-full max-w-full overflow-scroll sm:max-w-full lg:w-3/4 2xl:w-1/2">
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

type PurgeMessagesProps = {
    queue: api.Queue;
    onPurge?: VoidFunction;
};

function PurgeMessages({ queue, onPurge }: PurgeMessagesProps) {
    const purge = useMutation({
        mutationFn: () => api.purge(queue.name),
        onSuccess: () => {
            toast("Successfully purged messages ✅");
            onPurge && onPurge();
        },
        onError: () => toast("Failed to purge messages ⛔"),
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <TooltipBasic
                        message="Purge Messages"
                        className="text-red-500"
                    >
                        <span className="flex h-full w-full items-center justify-center">
                            <OctagonX className="h-[1.2rem] w-[1.2rem] text-red-500" />
                        </span>
                    </TooltipBasic>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will{" "}
                        <span className="font-bold text-red-500">
                            permanently
                        </span>{" "}
                        purge the messages from{" "}
                        <span className="italic">{queue.name}</span>.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        variant="destructive"
                        onClick={() => purge.mutate()}
                    >
                        Continue
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
