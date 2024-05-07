import React from "react";

export default function ClerkLayout({
    children
}: {
    children: React.ReactNode;
}) {
    return <div className="w-full h-full flex items-center justify-center pt-20">
        {children}
    </div>;
}
