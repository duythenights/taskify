"use client";
import React, { useEffect, useState } from "react";
import CardModal from "../modals/card-modal";
import ProModal from "../modals/card-modal/pro-modal";

export default function ModalProvider() {
    const [isMouted, setIsMouted] = useState(false);

    useEffect(()=> {
        setIsMouted(true)
    }, [])

    if(!isMouted){
        return null
    }

    return (
        <>
            <CardModal />
            <ProModal/>
        </>
    );
}
