import { AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AccordionContent } from "@radix-ui/react-accordion";
import { Activity, CreditCard, Layout, Settings } from "lucide-react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

export type Organization = {
    id: string;
    slug: string;
    imageUrl: string;
    name: string;
};

interface NavItemProps {
    isActive: boolean;
    isExpanded: boolean;
    organization: Organization;
    onExpand: (id: string) => void;
}
export default function NavItem({
    isActive,
    isExpanded,
    organization,
    onExpand,
}: NavItemProps) {
    const router = useRouter();
    const pathname = usePathname();
    const routes = [
        {
            label: "Boards",
            icon: <Layout className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}`,
        },
        {
            label: "Activity",
            icon: <Activity className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/activity`,
        },
        {
            label: "Settings",
            icon: <Settings className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/settings`,
        },
        {
            label: "Billing",
            icon: <CreditCard className="h-4 w-4 mr-2" />,
            href: `/organization/${organization.id}/billing`,
        },
    ];
    const onClick = (href: string) => {
        router.push(href);
    };
    return (
        <AccordionItem value={organization.id}>
            <AccordionTrigger
                onClick={() => onExpand(organization.id)}
                className={cn(
                    "bg-slate-400",
                    isActive && !isExpanded && "bg-sky-500"
                )}
            >
                <div className="flex">
                    <div className="w-7 h-7">
                        <Image
                            src={organization.imageUrl}
                            width={28}
                            height={28}
                            alt="organization image"
                            className="rounded-sm"
                        />
                    </div>

                    <span>{organization.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pt-1 text-neutral-700">
                {routes.map((route) => (
                    <Button
                        key={route.href}
                        size={"sm"}
                        onClick={() => onClick(route.href)}
                        className={cn(pathname === route.href && "bg-sky-500/10", "w-full")}
                        variant={"ghost"}
                    >
                        {route.icon}
                        {route.label}
                    </Button>
                ))}
            </AccordionContent>
        </AccordionItem>
    );
}
