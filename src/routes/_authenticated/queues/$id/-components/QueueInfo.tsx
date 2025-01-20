import { Ping } from "@/components/Ping";
import { Queue } from "@/lib/api";
import { cn, pluralise } from "@/lib/utils";

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
          {pluralise(queue.consumers, { word: "consumer" })}
        </small>
      </div>
      <div className="flex flex-row items-center gap-x-3">
        <Ping variant={queue.ready > 0 ? "amber" : "green"} />
        <small>
          <span className="font-bold">{queue.ready}</span>{" "}
          {pluralise(queue.ready, { word: "message" })} ready
        </small>
      </div>
      <div className="flex flex-row items-center gap-x-3">
        <Ping variant={queue.unacked > 0 ? "red" : "green"} />
        <small>
          <span className="font-bold">{queue.unacked}</span>{" "}
          {pluralise(queue.unacked, { word: "message" })} unacknowledged
        </small>
      </div>
    </div>
  );
}
