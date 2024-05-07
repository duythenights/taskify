"use client"

import ActivityItem from '@/components/activity-item'
import { Skeleton } from '@/components/ui/skeleton'
import { AuditLog } from '@prisma/client'
import { ActivityIcon } from 'lucide-react'
import React from 'react'

interface ActivityProps {
    data: AuditLog[]
}

export default function Activity({data}: ActivityProps) {

  return (
    <div className='flex gap-x-3 w-full'>
        <ActivityIcon/>

        <div>
            <p>Activity</p>
            <ol>
                {
                    data.map(item => (
                        <div key={item.id}>
                            <ActivityItem data={item}/> 
                        </div>
                    ))
                }
            </ol>
        </div>

    </div>
  )
}

Activity.Skeleton = function ActivitySkeleton(){
    return (
        <div className='w-full'>
            <Skeleton className='mb-2 w-full h-4 bg-slate-400'/>
            <Skeleton className='mb-2 w-full h-4 bg-slate-400'/>
            <Skeleton className='mb-2 w-full h-4 bg-slate-400'/>
        </div>
    )
}
