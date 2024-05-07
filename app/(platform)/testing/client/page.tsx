"use client";

import { createBoard } from "@/actions/create-board";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/use-action";
import { db } from "@/lib/db";
import {
    UserButton,
    useAuth,
    useOrganization,
    useOrganizationList,
    useUser,
} from "@clerk/nextjs";
import { useEffect, useState } from "react";

export default function Protected() {


    const { execute } = useAction(createBoard, {
        onSuccess: (data) => {
            console.log(data)
        }
    })

    const onSubmit = async (formData: FormData) => {
        const title = formData.get("title") as  string;
        execute({title})
        
    }
   
    return (
        <div>
            <form action={onSubmit}>
                <input
                    type="text"
                    id="title"
                    required
                    name="title"
                    placeholder="Enter a board title"
                    className="border-black border p-1"
                />
                <Button type="submit">Submit</Button>
            </form>

           
        </div>
    );
}
