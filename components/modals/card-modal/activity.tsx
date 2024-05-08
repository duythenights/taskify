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
    <div className='flex items-start gap-x-3 w-full mt-4'>
        <ActivityIcon/>

        <div className='w-full'>
            <p className='font-semibold text-neutral-700 mb-2'>Activity</p>
            <ol className='mt-2 space-y-4'>
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
        <div className='flex items-start gap-x-3 w-full'>
            <Skeleton className='w-6 h6 bg-neutral-200'/>
            <div className="w-full">
                <Skeleton className='w-24 h-6 mb-2 bg-neutral-200'/>
                <Skeleton className='w-full h-10 bg-neutral-200'/>
            </div>
        </div>
    )
}
