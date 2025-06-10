"use client";

import { Input } from "@/components/ui/input";
import { Check, Eye, EyeOff, X } from "lucide-react";
import { useId, useState, forwardRef } from "react";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    requirements: {
        regex: RegExp;
        text: string;
    }[];
    showStrength?: boolean;
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
    ({ requirements, showStrength = true, ...props }, ref) => {
        const [isVisible, setIsVisible] = useState(false);
        const id = useId();

        const checkStrength = (pass: string) => {
            return requirements.map((req) => ({
                met: req.regex.test(pass),
                text: req.text,
            }));
        };

        const strength = checkStrength(props.value as string || "");
        const strengthScore = strength.filter((req) => req.met).length;

        const getStrengthColor = (score: number) => {
            if (score === 0) return "bg-border";
            if (score <= 1) return "bg-red-500";
            if (score <= 2) return "bg-orange-500";
            if (score === 3) return "bg-amber-500";
            return "bg-emerald-500";
        };

        const getStrengthText = (score: number) => {
            if (score === 0) return "Digite sua senha";
            if (score <= 2) return "Senha fraca";
            if (score === 3) return "Senha média";
            return "Senha forte";
        };

        return (
            <div className="min-w-[300px]">
                <div className="space-y-2">
                    <div className="relative">
                        <Input
                            {...props}
                            ref={ref}
                            id={id}
                            className="pe-9"
                            type={isVisible ? "text" : "password"}
                            aria-invalid={strengthScore < requirements.length}
                            aria-describedby={showStrength ? `${id}-description` : undefined}
                        />
                        <button
                            type="button"
                            onClick={() => setIsVisible(!isVisible)}
                            className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70"
                        >
                            {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                    </div>
                </div>

                {showStrength && (
                    <>
                        <div className="mb-4 mt-3 h-1 w-full overflow-hidden rounded-full bg-border">
                            <div
                                className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                                style={{ width: `${(strengthScore / requirements.length) * 100}%` }}
                            />
                        </div>

                        <p id={`${id}-description`} className="mb-2 text-sm font-medium">
                            {getStrengthText(strengthScore)}
                        </p>

                        <ul className="space-y-1.5">
                            {strength.map((req, index) => (
                                <li key={index} className="flex items-center gap-2">
                                    {req.met ? (
                                        <Check size={16} className="text-emerald-500" />
                                    ) : (
                                        <X size={16} className="text-muted-foreground/80" />
                                    )}
                                    <span className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}>
                                        {req.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
        );
    }
);

PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
