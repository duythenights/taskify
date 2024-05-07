"use client"

import { forwardRef } from "react";
import { useFormStatus } from "react-dom";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { cn } from "@/lib/utils";
import { FormErrors } from "./form-errors";

interface FormInputProps {
    id: string;
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    disabled?: boolean;
    errors?: Record<string, string[] | undefined > 
    className?: string;
    defaultValue?: string;
    onBlur?: () => void
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(({
    id,
    label,
    placeholder,
    required,
    disabled,
    errors,
    className,
    type,
    defaultValue = "",
    onBlur
}, ref ) => {
     const {pending} = useFormStatus()


     return (
        <div>
            <div>

            {
                label && <Label htmlFor={id}>{label}</Label>
            } 
            <Input 
                onBlur={onBlur}       
                defaultValue={defaultValue}
                ref={ref}
                required={required}
                name={id}
                id={id} 
                placeholder={placeholder}
                type={type}
                disabled={pending || disabled}
                className={cn("text-sm", className)} 
                aria-describedby={`${id}-error`}
            />
            </div>
            <FormErrors
                id={id} 
                errors={errors}
            />
        </div>
     )
})


FormInput.displayName = "FormInput";