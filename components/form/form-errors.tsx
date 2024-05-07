import { XCircleIcon } from "lucide-react";

interface FormErrorsProps {
    id: string;
    errors?: Record<string, string[] | undefined>;
}

export const FormErrors = ({ id, errors }: FormErrorsProps) => {
    if (!errors) return null;

    return (
        <div id={`${id}-error`} aria-live="polite" className="text-rose-500">
            {errors?.[id]?.map((error: string) => (
                <div key={error}><XCircleIcon/>{error}</div>
            ))}
        </div>
    );
};
