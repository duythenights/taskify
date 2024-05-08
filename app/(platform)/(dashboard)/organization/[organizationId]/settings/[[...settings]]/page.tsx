import { OrganizationProfile } from "@clerk/nextjs";
import React from "react";

export default function SettingsPage() {
    return (
        <div className="w-full">
            <OrganizationProfile
                appearance={{
                    elements: {
                        rootBox: {
                            boxShadow: "none",
                            width: "100%",
                        },
                        cardBox: {
                            border: "1px solid #e5e5e5",
                            boxShadow: "none",
                            width: "100%",
                        },
                    },
                }}
            />
        </div>
    );
}
