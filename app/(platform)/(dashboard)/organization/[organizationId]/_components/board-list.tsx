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



export const BoardList = async () => {
    const {orgId} = auth()

    if(!orgId) {
        redirect("/select-org")
    }

    const boards = await db.board.findMany({
        where: {
            orgId
        },
        orderBy:{
            createdAt: "desc"
        }
    })

    const availableCount = await getAvailableCount()
    const isPro = await checkSubscription()


    return (
        <div>
            <div className="flex">
                <User2 />
                Your board
            </div>
            <div className="grid grid-cols-2 md:grid-flow-col-3 lg:grid-flow-col-4">
                {boards.map((item) => (
                    <Link href={`/board/${item.id}`} key={item.id}>
                        <div className="relative">
                            <Image
                                width={40}
                                height={40}
                                src={item.imageThumbUrl}
                                alt="board"
                                className="object-cover"
                            />
                            <p className="absolute top-0 left-0">
                                {item.title}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                <FormPopover side="right" sideOffset={50}>
                    <div className="w-full h-full bg-slate-200">
                        <p>Create new board</p>

                        <span>{isPro ? "Unlimited" :availableCount} remaining</span>
                        <Hint
                            sideOffset={10}
                            description={`Free can have 5 ....`}
                        >
                            <HelpCircle className="" />
                        </Hint>
                    </div>
                </FormPopover>
            </div>
        </div>
    );
};

BoardList.Skeleton = function SkeletonList() {
    return <div className="">Loading.......</div>;
};
