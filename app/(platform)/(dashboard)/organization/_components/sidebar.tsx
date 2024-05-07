"use client";
import { Accordion } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Plus } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useLocalStorage } from "usehooks-ts";
import NavItem, { Organization } from "./nav-item";

interface SidebarProps {
    storageKey?: string;
}

export default function Sidebar({
    storageKey = "t-sidebar-state",
}: SidebarProps) {
    const [expanded, setExpanded] = useLocalStorage<Record<string, any>>(
        storageKey,
        {}
    );
    const { organization: activeOrganizaiton, isLoaded: isLoadedOrg } =
        useOrganization();

    const { userMemberships, isLoaded: isLoadedOrgList } = useOrganizationList({
        userMemberships: {
            infinite: true,
        },
    });

    const defaultAccordionValue: string[] = Object.keys(expanded).reduce(
        (acc: string[], key: string) => {
            if (expanded[key]) {
                acc.push(key);
            }

            return acc;
        },
        []
    );

    const onExpand = (id: string) => {
        setExpanded((curr) => ({
            ...expanded,
            [id]: !expanded[id],
        }));
    };

    if (!isLoadedOrg || !isLoadedOrgList || userMemberships.isLoading) {
        return (
            <>
               <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-10"/>
                <Skeleton className="w-full h-10"/>
                <Skeleton className="w-full h-10"/>
                <Skeleton className="w-full h-10"/>
                </div> 
            </>
        );
    }

    return (
        <>
            <div>
                <span>Workspace</span>
                <Button variant={"ghost"} className="ml-auto">
                    <Link href={"/select-org"}>
                        <Plus />
                    </Link>
                </Button>
            </div>
            <Accordion type="multiple" defaultValue={defaultAccordionValue}>
                {userMemberships.data.map(({ organization }) => (
                    <NavItem
                        key={organization.id}
                        isActive={activeOrganizaiton?.id === organization.id}
                        isExpanded={expanded[organization.id]}
                        organization={organization as Organization}
                        onExpand={onExpand}
                    />
                ))}
            </Accordion>
        </>
    );
}
