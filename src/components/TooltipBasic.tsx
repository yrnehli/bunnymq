import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export type TooltipBasicProps = {
    message: string;
    children: React.ReactNode;
    className?: string;
};

export function TooltipBasic({
    message,
    children,
    className,
}: TooltipBasicProps) {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>{children}</TooltipTrigger>
                <TooltipContent className={className}>{message}</TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
