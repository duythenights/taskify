import { AuditLog } from '@prisma/client'
import {format} from "date-fns"
import React from 'react'
import { Avatar, AvatarImage } from './ui/avatar'
import { generateLogMessage } from '@/lib/generate-log-message'

interface ActivityItemProps {
    data: AuditLog
}

export default function ActivityItem({data}: ActivityItemProps) {

  return (
    <li className='flex items-center gap-x-2'>
        <Avatar className='h-8 w-8'>
            <AvatarImage src={data.userImage}/>
        </Avatar>
        <div>
            <p>
                <span>
                    {data.userName} 
                </span> 
                {generateLogMessage(data)}
            </p>

            <p className='text-xs text-muted-foreground'>
                {format(new Date(data.createdAt),"MMM d, yyyy 'at' h:mm a" )}                
            </p>
        </div>
    </li>
  )
}