import Editor from "@monaco-editor/react";
import {
    useMutation,
    useQueryClient,
    useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import dedent from "dedent";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import ts from "typescript";
import { RefreshButton } from "@/components/RefreshButton";
import { Spinner } from "@/components/Spinner";
import { SyntaxHighlighter } from "@/components/SyntaxHighlighter";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import * as api from "@/lib/api";
import { Route } from "@/routes/queues/$id";
import { PurgeMessages } from "@/routes/queues/$id/-PurgeMessages";
import { QueueInfo } from "@/routes/queues/$id/-QueueInfo";
import { ViewMessages } from "@/routes/queues/$id/-ViewMessages";

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
        const fn = new Function(ts.transpile(code));
        const res = fn() as unknown;
        return typeof res === "string" ? res.trim() : null;
    } catch (_) {
        return null;
    }
};

export function QueueControl() {
    const search = Route.useSearch();
    const navigate = useNavigate();
    const { appearance } = useTheme();
    const { id: queueId } = useParams({ from: "/queues/$id/" });
    const [code, setCode] = useState(search.code ?? DEFAULT_CODE);
    const environment = api.getEnvironment();
    const queryClient = useQueryClient();
    const output = computeCode(code);
    const queryKeys = {
        queue: ["queue", queueId],
        messages: ["messages", queueId],
    } as const;

    const { data: queue, isFetching: queueFetching } = useSuspenseQuery({
        queryKey: queryKeys.queue,
        queryFn: () => api.queue(queueId),
    });

    const { data: messages, isFetching: messagesFetching } = useSuspenseQuery({
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

    useEffect(() => {
        const debounce = setTimeout(() => {
            void navigate({
                search: {
                    code: code,
                },
                replace: true,
            });
        }, 300);

        return () => clearTimeout(debounce);
    }, [code, navigate]);

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
                    <RefreshButton
                        disabled={queueFetching || messagesFetching}
                        onClick={() => invalidateQueries()}
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
                        Invalid message construction, expected a non-empty
                        string to be returned!
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
