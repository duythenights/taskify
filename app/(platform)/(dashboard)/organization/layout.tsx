import React from "react";
import Sidebar from "./_components/sidebar";

export default function OrganizationLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="pt-10 ">
            <div className="flex gap-x-7">
                <div className="w-64 shrink-0">
                    <Sidebar />
                </div>
                {children}
            </div>
        </main>
    );
}
