"use client";
import React, { KeyboardEventHandler, forwardRef } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";
import { useFormStatus } from "react-dom";

interface FormTextAreaProps {
    id: string;
    label?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined>;
    className?: string;
    onBlur?: () => void;
    onClick?: () => void;
    onKeyDown?: KeyboardEventHandler<HTMLTextAreaElement> | undefined;
    defaultValue?: string;
}

export const FormTextArea = forwardRef<HTMLTextAreaElement, FormTextAreaProps>(
    (
        {
            id,
            className,
            defaultValue,
            disabled,
            errors,
            label,
            onBlur,
            onClick,
            onKeyDown,
            placeholder,
            required,
        },
        ref
    ) => {
        const { pending } = useFormStatus();
        return (
            <div className="space-y-2 w-full">
                <div className="space-y-1 w-full">

                {label && (
                        <Label htmlFor={id}
                       className="text-xs font-semibold text-neutral-700" 
                        >{label}</Label>
                )}
                <Textarea
                    onClick={onClick}
                    onBlur={onBlur}
                    onKeyDown={onKeyDown}
                    ref={ref}
                    required={required}
                    name={id}
                    id={id}
                    disabled={disabled || pending}
                    className={cn(className, "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm")}
                    aria-describedby={`${id}-error`}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                />
                <FormErrors id={id} errors={errors} />

                </div>
            </div>
        );
    }
);

FormTextArea.displayName = "FormTextArea";
