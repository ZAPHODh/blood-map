"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Session } from "@/lib/auth/types";
import { signinSchema } from "@/lib/zod/signin-schema";
import Link from "next/link";
import { useSession } from "./session-provider";
import { useRouter } from "next/navigation";

function SignIn({
    className,
    ...props
}: React.ComponentPropsWithoutRef<"div">) {
    const { setSession } = useSession();
    const router = useRouter();
    const form = useForm<z.infer<typeof signinSchema>>({
        resolver: zodResolver(signinSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function onSubmit(values: z.infer<typeof signinSchema>) {
        const res = await fetch("/api/auth/signin", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: values.email,
                password: values.password,
            }),
        });

        if (!res.ok) {
            toast("Erro ao entrar", {
                description: "Verifique seu e-mail e senha e tente novamente.",
            });
            return;
        }

        const session: Session = await res.json();
        setSession(session);
        router.push("/");
    }

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
            <Card className="border-none shadow-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
                    <CardDescription>Faça login na sua conta para continuar.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full my-2">
                            <div className="flex flex-col gap-2">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Seu e-mail</FormLabel>
                                            <FormControl>
                                                <Input placeholder="exemplo@email.com" {...field} />
                                            </FormControl>
                                            <FormDescription>Digite o endereço de e-mail usado na criação da conta.</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Sua senha</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="password"
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>Use a senha senha</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <Button type="submit" className="w-full rounded">
                                Entrar
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-sm">
                        Ainda não tem uma conta?{" "}
                        <Link href="/auth/signup" className="underline underline-offset-4">
                            Criar conta
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export { SignIn };
