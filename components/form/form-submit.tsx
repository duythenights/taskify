"use client";
import React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface FormSubmitProps {
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
    variant?:
        | "default"
        | "destructive"
        | "outline"
        | "secondary"
        | "ghost"
        | "link"
        | null
        | undefined;
}

export default function FormSubmit({
    children,
    className,
    disabled,
    variant,
}: FormSubmitProps) {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            variant={variant}
            className={cn("", className)}
            disabled={pending || disabled}
        >
            {children}
        </Button>
    );
}
