import { Suspense } from "react";
import { BoardList } from "./_components/board-list";
import Info from "./_components/info";
import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

export default async function OrganizationIdPage() {
    const isPro = await checkSubscription()
    return (
        <div className="w-full mb-20">
            <Info isPro={isPro} />
            <Separator />
            <Suspense fallback={<BoardList.Skeleton />}>
                <BoardList />
            </Suspense>
        </div>
    );
}
