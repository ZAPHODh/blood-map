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
import { Separator } from "@/components/ui/separator";
import { PasswordInput } from "./ui/password";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Link from "next/link";

import { signupSchema } from "@/lib/zod/signup-schema";
import { useRouter } from "next/navigation";

function SignUp({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();

    const form = useForm<z.infer<typeof signupSchema>>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            cep: "",
        },
    });

    const passwordRequirements = [
        { regex: /.{8,}/, text: "Mínimo de 8 caracteres" },
        { regex: /[0-9]/, text: "Pelo menos um número" },
        { regex: /[a-z]/, text: "Pelo menos uma letra minúscula" },
        { regex: /[A-Z]/, text: "Pelo menos uma letra maiúscula" },
    ];

    async function onSubmit(values: z.infer<typeof signupSchema>) {
        const res = await fetch("/api/auth/credentials-signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
        });

        if (!res.ok) {
            toast("Erro ao cadastrar", {
                description: "Verifique os dados e tente novamente.",
            });
            return;
        }

        router.push("/");
    }

    return (
        <div className={cn("flex flex-col", className)} {...props}>
            <Card className="shadow-none border-none">
                <CardHeader>
                    <CardTitle className="text-2xl">Criar conta</CardTitle>
                    <CardDescription>Preencha os campos abaixo para se cadastrar</CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 w-full my-2"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nome</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Digite seu nome" {...field} />
                                        </FormControl>
                                        <FormDescription>Como você gostaria de ser chamado</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="exemplo@dominio.com" {...field} />
                                        </FormControl>
                                        <FormDescription>Você usará este email para fazer login</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="cep"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>CEP</FormLabel>
                                        <FormControl>
                                            <Input placeholder="exemplo@dominio.com" {...field} />
                                        </FormControl>
                                        <FormDescription>Digite seu cep</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Senha</FormLabel>
                                        <FormControl>
                                            <PasswordInput
                                                requirements={passwordRequirements}
                                                showStrength={true}
                                                placeholder="Digite uma senha segura"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Separator className="my-4" />
                            <Button type="submit" className="w-full rounded">
                                Criar conta
                            </Button>
                        </form>
                    </Form>
                    <div className="mt-4 text-center text-xs p-0 m-0">
                        Já tem uma conta?{" "}
                        <Link href="/auth/signin" className="underline underline-offset-4">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export { SignUp };
