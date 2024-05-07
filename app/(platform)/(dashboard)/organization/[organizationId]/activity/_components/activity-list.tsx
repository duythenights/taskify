import ActivityItem from "@/components/activity-item";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

export default async function ActivityList() {
    const { orgId } = auth();

    if(!orgId) {
        redirect("/select-org")
    }

    const auditLogs = await db.auditLog.findMany({
        where: {
            orgID: orgId
        }
    })


    return <ol>
        <p className="hidden last:block ">
            No activity
        </p>

        {
            auditLogs.map((log) => (
                <ActivityItem key={log.id} data={log}/>
            ))
        }
    </ol>;
}

ActivityList.Skeleton = function ActivitySkeleton () {
    return (
        <div>
            <Skeleton className="w-20 h-3"/>
            <Skeleton className="w-20 h-3"/>
            <Skeleton className="w-20 h-3"/>
            <Skeleton className="w-20 h-3"/>
        </div>
    )
}
