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

    const { execute, isLoading } = useAction(stripeRedirect, {
        onSuccess: (data) => {
            window.location.href = data;
        },
        onError: (error) => {
            toast.error(error);
        },
    });

    const handleClick = () => {
        execute({});
    };

    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent className="max-w-md p-0 overflow-hidden">
                <div className="aspect-video relative flex items-center justify-center">
                    <Image
                        src="/payment.png"
                        fill
                        alt="hero"
                        className="object-cover"
                    />
                </div>


                <div className="text-neutral-700  space-y-6 p-6 ">
                    <h2 className="font-semibold text-xl md:text-2xl">Upgrade to Taskify Pro today!</h2>
                    <p className="text-sm md:text-lg font-semibold text-neutral-600">Explore the best of Taskify</p>
                    <div className="pl-3">
                        <ul className="text-sm md:text-lg list-disc">
                            <li>Unlimited boards</li>
                            <li>Advanced activities</li>
                            <li>Admin and security features</li>
                            <li>And more than you think</li>
                            <li>...</li>
                        </ul>
                    </div>
                    <Button
                        className="w-full"
                        disabled={isLoading}
                        onClick={handleClick}
                        variant={"primary"}
                        size={"lg"}
                    >
                        Shut up and take my money
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
