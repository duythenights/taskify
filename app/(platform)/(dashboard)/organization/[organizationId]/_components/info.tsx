"use client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useOrganization } from "@clerk/nextjs";
import { CreditCard } from "lucide-react";
import Image from "next/image";
import { BoardList } from "./board-list";
import { Suspense } from "react";

interface InfoProps {
    isPro: boolean
}

export default function Info({isPro}: InfoProps) {
    const { organization, isLoaded } = useOrganization();

    if (!isLoaded) return <Info.Skeleton />;

    return (
        <div>
           
                <div>
                    <Image
                        width={30}
                        height={30}
                        src={organization?.imageUrl as string}
                        alt="Organiztion"
                    />
                    <div>
                        <p>{organization?.name}</p>
                        <CreditCard />
                        {
                            isPro? "Pro": "Free"
                        }
                    </div>
                </div>
            
        </div>
    );
}

Info.Skeleton = function SkeletonInfo() {
    return (
        <div className="w-32 h-full  flex ">
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
            <Skeleton className="w-full h-full" />
        </div>
    );
};
