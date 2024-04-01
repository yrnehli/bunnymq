import { Button } from "@/components/ui/button";

export function ErrorPage() {
    return (
        <div className="mb-24 mt-24 flex flex-col items-center">
            <h1 className="text-[48px] font-bold">
                Task Failed Successsfully 😵‍💫
            </h1>
            <div className="mb-6 text-xl">
                Something went wrong, check the console for more information.
            </div>
            <a href="/">
                <Button variant="secondary" className="text-md">
                    Take Me Home
                </Button>
            </a>
        </div>
    );
}
