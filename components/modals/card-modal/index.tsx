"use client";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCardModel } from "@/hooks/use-card-modal";
import { fetcher } from "@/lib/fetcher";
import { CardWithList } from "@/types";
import { useQuery } from "@tanstack/react-query";

import React from "react";
import Header from "./header";
import Description from "./description";
import { Button } from "@/components/ui/button";
import Actions from "./actions";
import { AuditLog } from "@prisma/client";
import Activity from "./activity";

export default function CardModal() {
    const id = useCardModel((state) => state.id);
    const isOpen = useCardModel((state) => state.isOpen);
    const onClose = useCardModel((state) => state.onClose);

    const { data: cardData } = useQuery<CardWithList>({
        queryKey: ["card", id],
        queryFn: () => fetcher(`/api/cards/${id}`),
    });
    const { data: auditLogsData } = useQuery<AuditLog[]>({
        queryKey: ["card-logs", id],
        queryFn: () => fetcher(`/api/cards/${id}/logs`),
    });

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}

                <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
                    <div className="col-span-3">
                        {!cardData ? (
                            <Description.Skeleton />
                        ) : (
                            <Description data={cardData} />
                        )}
                        {!auditLogsData ? (
                            <Activity.Skeleton />
                        ) : (
                            <Activity data={auditLogsData} />
                        )}
                    </div>
                    {!cardData ? (
                        <Actions.Skeleton />
                    ) : (
                        <Actions data={cardData} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
