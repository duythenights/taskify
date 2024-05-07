import React, { Suspense } from "react";
import Info from "../_components/info";
import { Separator } from "@/components/ui/separator";
import ActivityList from "./_components/activity-list";
import { checkSubscription } from "@/lib/subscription";

export default async function ActivityPage() {
    const isPro = await checkSubscription()
    return (
        <div className="text-black pt-20 w-full">
            <Info isPro={isPro} />
            <Separator />
            <Suspense fallback={<ActivityList.Skeleton />}>
                <ActivityList />
            </Suspense>
        </div>
    );
}
