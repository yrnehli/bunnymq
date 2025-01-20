import { useMutation } from "@tanstack/react-query";
import { OctagonX } from "lucide-react";
import { toast } from "sonner";
import { TooltipBasic } from "@/components/TooltipBasic";
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
import * as api from "@/lib/api";

export type PurgeMessagesProps = {
  queue: api.Queue;
  onPurge?: VoidFunction;
};

export function PurgeMessages({ queue, onPurge }: PurgeMessagesProps) {
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
          <TooltipBasic message="Purge Messages" className="text-red-500">
            <span className="flex h-full w-full items-center justify-center">
              <OctagonX className="h-[1.2rem] w-[1.2rem] text-red-500" />
            </span>
          </TooltipBasic>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will{" "}
            <span className="font-bold text-red-500">permanently</span> purge
            the messages from <span className="italic">{queue.name}</span>.
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
