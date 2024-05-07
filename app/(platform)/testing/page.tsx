import Link from "next/link";
import React from "react";

export default function Testing() {
    return (
        <div>
            <Link href={"/testing/client"}>client</Link>
            <Link href={"/testing/server"}>server</Link>
        </div>
    );
}
