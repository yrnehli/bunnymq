import { Ping } from "@/components/Ping";
import { Queue } from "@/lib/api";
import { cn } from "@/lib/utils";

export interface QueueInfoProps extends React.HTMLAttributes<HTMLDivElement> {
    queue: Queue;
}

export function QueueInfo({ queue, className, ...props }: QueueInfoProps) {
    return (
        <div
            className={cn("flex flex-col gap-x-8 sm:flex-row", className)}
            {...props}
        >
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
