"use client";
import { stripeRedirect } from "@/actions/stripe-redirect";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAction } from "@/hooks/use-action";
import { useProModal } from "@/hooks/use-pro-modal";
import Image from "next/image";
import React from "react";
import { toast } from "sonner";

export default function ProModal() {
    const proModal = useProModal();

    const {execute, isLoading} = useAction(stripeRedirect, {
        onSuccess:(data)=> {
            window.location.href = data
        },
        onError:(error)=>{
            toast.error(error)
        }
    })

    const handleClick = () =>{
        execute({})
    }

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <div className="aspect-video relative flex items-center justify-center">
                    <Image
                        src="/payment.png"
                        fill
                        alt="hero"
                        className="object-cover"
                    />
                </div>

                <div>
                    Upgrade to Taskify pro today!
                    <p>Explore the best of Taskify</p>
                    <div>
                        <ul>
                            <li>Unlimited boards</li>
                            <li>Unlimited boards</li>
                            <li>Unlimited boards</li>
                            <li>Unlimited boards</li>
                        </ul>
                    </div>
                    <Button className="w-full" disabled={isLoading} onClick={handleClick}>Upgrade</Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
