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
            <div>
                {label && (
                    <div>
                        <Label>{label}</Label>
                    </div>
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
                    className={cn(className)}
                    aria-describedby={`${id}-error`}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                />
                <FormErrors id={id} errors={errors} />
            </div>
        );
    }
);

FormTextArea.displayName = "FormTextArea";
