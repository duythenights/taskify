import FormPopover from "@/components/form/form-popover";
import Hint from "@/components/hint";
import { useAuth } from "@clerk/nextjs";
import { HelpCircle, User2 } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Board } from "@prisma/client";
import { getBoards } from "@/actions/get-board";
import Link from "next/link";
import Image from "next/image";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getAvailableCount } from "@/lib/org-limit";
import { checkSubscription } from "@/lib/subscription";
import { Skeleton } from "@/components/ui/skeleton";

export const BoardList = async () => {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const boards = await db.board.findMany({
        where: {
            orgId,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    const availableCount = await getAvailableCount();
    const isPro = await checkSubscription();

    return (
        <div className="space-y-4">
            <div className="flex items-center font-semibold text-lg text-neutral-700">
                <User2 className="h-6 w-6 mr-2" />
                Your board
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {boards.map((item) => (
                    <Link href={`/board/${item.id}`} key={item.id} style={{
                        backgroundImage: `url(${item.imageThumbUrl})`
                    }}
                        className="group relative aspect-video bg-no-repeat bg-center bg-cover  rounded-sm  h-full w-full p-2 n" 
                    >
                       <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition rounded-sm"/> 
                       <p className="relative font-semibold text-white">
                        {item.title}
                       </p>
                    </Link>
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FormPopover side="right" sideOffset={10}>
                    <div className="aspect-video relative h-full w-full bg-muted rounded-sm flex flex-col gap-y-1 items-center justify-center hover:opacity-75 transition">
                        <p className="text-sm">Create new board</p>

                        <span className="text-xs">
                            {isPro ? "Unlimited" : availableCount} remaining
                        </span>
                        <Hint
                            sideOffset={40}
                            description={`Free Workspace can have up to 5 open boards. For unlimited boards upgrade this workspace`}
                        >
                            <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
};

BoardList.Skeleton = function SkeletonList() {
    return <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>
        <Skeleton className="aspect-video h-full w-full p-2x"/>

    </div>;
};
