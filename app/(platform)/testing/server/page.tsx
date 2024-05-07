import { auth, currentUser } from "@clerk/nextjs/server";
import React from "react";

export default async function Protected() {
    const user = await currentUser();
    const { userId } = auth();
    return (
        <div>
            Hello {user?.firstName}
            {userId}
        </div>
    );
}
