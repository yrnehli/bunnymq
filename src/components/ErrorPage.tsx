import { Button } from "@/components/ui/button";

export function ErrorPage() {
    return (
        <div className="mb-24 mt-24 flex flex-col items-center px-6">
            <h1 className="mb-3 text-balance text-center text-[28px] font-bold sm:text-[40px] md:text-[52px]">
                Task Failed Successsfully 😵‍💫
            </h1>
            <div className="mb-6 text-balance text-center text-xl">
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
