import { Spinner } from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ENVIRONMENT_NAMES } from "@/config";
import * as api from "@/lib/api";
import { isAuthenticated } from "@/lib/auth";
import { setCookie } from "@/lib/cookies";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { createFileRoute, redirect, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const loginSearchSchema = z.object({
    next: z.string().optional(),
});

export const Route = createFileRoute("/login")({
    component: Login,
    validateSearch: (search: Record<string, unknown>) => {
        return loginSearchSchema.parse(search);
    },
    beforeLoad: async () => {
        const authenticated = await isAuthenticated();
        if (authenticated) {
            throw redirect({
                to: "/",
            });
        }
    },
});

const loginFormSchema = z.object({
    environment: z.enum(ENVIRONMENT_NAMES),
    username: z.string().min(1, {
        message: "Username must be at least 1 character.",
    }),
    password: z.string().min(1, {
        message: "Password must be at least 1 character.",
    }),
});

function Login() {
    const { next } = Route.useSearch();
    const navigate = useNavigate();

    const loginForm = useForm<z.infer<typeof loginFormSchema>>({
        resolver: zodResolver(loginFormSchema),
        defaultValues: {
            environment: ENVIRONMENT_NAMES[0],
            username: "",
            password: "",
        },
    });

    const login = useMutation({
        mutationFn: (values: z.infer<typeof loginFormSchema>) => {
            const credentials = btoa(`${values.username}:${values.password}`);

            setCookie("credentials", credentials);
            setCookie("environment", values.environment);

            return api.login(credentials);
        },
        onSuccess: () => navigate({ to: next ?? "/", replace: true }),
        onError: () => {
            toast("Login Failed ⛔", {
                description: "Please try again!",
            });
        },
    });

    const onLoginFormSubmit = (values: z.infer<typeof loginFormSchema>) => {
        login.mutate(values);
    };

    return (
        <div className="mt-5 flex flex-col justify-center sm:mt-10">
            <div className="mb-12">
                <h1 className="text-center text-[72px] font-bold">
                    BunnyMQ 🐇
                </h1>
                <div className="text-center italic text-gray-500 dark:text-gray-300">
                    A modern RabbitMQ web management interface
                </div>
            </div>
            <Form {...loginForm}>
                <form
                    onSubmit={loginForm.handleSubmit(onLoginFormSubmit)}
                    className="flex flex-col items-center"
                >
                    <div className="mb-4">
                        <FormField
                            control={loginForm.control}
                            name="environment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="ms-1">
                                        Environment
                                    </FormLabel>
                                    <Select
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="w-72">
                                                <SelectValue placeholder="Select environment" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {ENVIRONMENT_NAMES.map(
                                                (name, i) => (
                                                    <SelectItem
                                                        value={name}
                                                        key={i}
                                                    >
                                                        {name}
                                                    </SelectItem>
                                                ),
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                    </div>
                    <div className="mb-4 flex flex-col gap-y-2">
                        <FormField
                            control={loginForm.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem className="w-72">
                                    <FormControl>
                                        <Input
                                            placeholder="Username"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={loginForm.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem className="w-72">
                                    <FormControl>
                                        <Input
                                            type="password"
                                            placeholder="Password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-72"
                        disabled={login.isPending}
                    >
                        {login.isPending && <Spinner />}
                        Login
                    </Button>
                </form>
            </Form>
        </div>
    );
}
