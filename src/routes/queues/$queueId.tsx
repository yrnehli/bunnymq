import { Ping } from "@/components/Ping";
import { Spinner } from "@/components/Spinner";
import { useTheme } from "@/components/ThemeProvider";
import { QueueSkeleton } from "@/components/skeletons/QueueSkeleton";
import { Button } from "@/components/ui/button";
import * as API from "@/lib/api";
import { Queue, queue } from "@/lib/api";
import { checkAuthenticated } from "@/routes/__root";
import Editor from "@monaco-editor/react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createFileRoute, useParams } from "@tanstack/react-router";
import dedent from "dedent";
import { useState } from "react";
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
import json from "react-syntax-highlighter/dist/esm/languages/hljs/json";
import { vs, vs2015 } from "react-syntax-highlighter/dist/esm/styles/hljs";
import { toast } from "sonner";

// eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
SyntaxHighlighter.registerLanguage("json", json);

type ReactSyntaxHighlighterTheme = {
    [key: string]: React.CSSProperties;
};

export const Route = createFileRoute("/queues/$queueId")({
    component: Queue,
    beforeLoad: async ({ location }) => await checkAuthenticated(location.href),
});

const DEFAULT_CODE = dedent`
    const message = "foo";
    const payload = "bar";

    // Return a string to publish to the queue
    return JSON.stringify([message, payload]);
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
    const { theme } = useTheme();
    const { queueId } = useParams({ from: "/queues/$queueId" });
    const [code, setCode] = useState(DEFAULT_CODE);
    const output = computeCode(code);

    const { isLoading, data } = useQuery({
        queryKey: ["queue", queueId],
        queryFn: () => queue(queueId),
    });

    const publishMessage = useMutation({
        mutationFn: (message: string) => API.publish(queueId, message),
        onSuccess: () => toast("Successfully published message ✅"),
        onError: () => toast("Failed to publish message ⛔"),
    });

    if (isLoading || !data) {
        return <QueueSkeleton />;
    }

    return (
        <div className="grid gap-y-8">
            <div>
                <h1 className="mb-2 text-2xl font-bold">{queueId}</h1>
                <QueueInfo queue={data} />
            </div>
            <div>
                <div className="mb-1 text-lg font-medium">
                    Construct Message 🚧
                </div>
                <Editor
                    height="400px"
                    className="border"
                    theme={theme === "dark" ? "vs-dark" : "light"}
                    defaultLanguage="javascript"
                    defaultValue={DEFAULT_CODE}
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
                        style={
                            theme === "dark"
                                ? (vs2015 as ReactSyntaxHighlighterTheme)
                                : (vs as ReactSyntaxHighlighterTheme)
                        }
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
    queue: Queue;
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
                    {queue.ready === 1 ? "message" : "messages"} unacknowledged
                </small>
            </div>
        </div>
    );
}