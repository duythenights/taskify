import FormPopover from "@/components/form/form-popover";
import { Button } from "@/components/ui/button";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Navbar() {
    return (
        <div className="h-20 w-full bg-slate-300 px-10 flex items-center justify-between fixed top-0 left-0 z-10" >
            <div className="flex items-center gap-10">
                <Link href="/">
                <h2>logo</h2>
                </Link>
                <FormPopover align="start" side="bottom" sideOffset={18}>

                <Button>Create</Button>
                </FormPopover>
            </div>

            <div>
                <OrganizationSwitcher
                    hidePersonal
                    afterCreateOrganizationUrl={"/organization/:id"}
                    afterLeaveOrganizationUrl={"/select-org"}
                    afterSelectOrganizationUrl={"/organization/:id"}
                />
                <UserButton />
            </div>
        </div>
    );
}
