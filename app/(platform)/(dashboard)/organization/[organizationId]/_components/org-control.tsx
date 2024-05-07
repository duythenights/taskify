"use client";
import { useOrganizationList } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

export default function OrgControl() {
    const params = useParams();

    const { setActive } = useOrganizationList();

    useEffect(() => {
        if (!setActive) return;

        setActive({
            organization: params.organizationId as string,
        });
    }, [setActive, params.organizationId]);
    return null;
}
