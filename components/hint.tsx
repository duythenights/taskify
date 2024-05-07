import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface HintProps {
    children: React.ReactNode;
    description: string;
    side?: "left" | "right" | "top" | "bottom";
    sideOffset?: number;
}

export default function Hint({
    children,
    description,
    side="bottom",
    sideOffset=0,
}: HintProps) {
    return (
        <TooltipProvider delayDuration={0}>
            <Tooltip>
                <TooltipTrigger>
                    {children}
                </TooltipTrigger>

                <TooltipContent
                     sideOffset={sideOffset}
                     side={side}
                     className="text-sm max-w-[220px] break-words"
                
                >
                    {description}
                </TooltipContent>

            </Tooltip>
        </TooltipProvider>
    );
}
