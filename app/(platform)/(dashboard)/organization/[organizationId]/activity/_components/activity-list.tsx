import ActivityItem from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ActivityList() {
    const { orgId } = auth();

    if (!orgId) {
        redirect("/select-org");
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgID: orgId,
        },
    });

    return (
        <ol className="space-y-4 mt-4">
            <p className="hidden last:block text-xs text-center text-muted-foreground">
                No activity found inside this organization
            </p>

            {auditLogs.map((log) => (
                <ActivityItem key={log.id} data={log} />
            ))}
        </ol>
    );
}

ActivityList.Skeleton = function ActivitySkeleton() {
    return (
        <div className="space-y-4 mt-4">
            <Skeleton className="w-[80%] h-14" />
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[70%] h-14" />
            <Skeleton className="w-[60%] h-14" />
            <Skeleton className="w-[90%] h-14" />
            <Skeleton className="w-[80%] h-14" />
            <Skeleton className="w-[50%] h-14" />
            <Skeleton className="w-[70%] h-14" />
            <Skeleton className="w-[60%] h-14" />
            <Skeleton className="w-[90%] h-14" />
        </div>
    );
};
