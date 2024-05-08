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
                <div className="flex items-center justify-between mb-2">
                    <Skeleton className="w-[50%] h-10" />
                    <Skeleton className="w-10 h-10" />
                </div>

                <div className="space-y-2">
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                    <NavItem.Skeleton />
                </div>
            </>
        );
    }

    return (
        <>
            <div className="font-medium text-xs flex items-center mb-1">
                <span className="pl-4">Workspace</span>
                <Button
                    variant={"ghost"}
                    className="ml-auto"
                    type="button"
                    size={"icon"}
                >
                    <Link href={"/select-org"}>
                        <Plus className="w-4 h4" />
                    </Link>
                </Button>
            </div>
            <Accordion
                type="multiple"
                defaultValue={defaultAccordionValue}
                className="space-y-2"
            >
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
