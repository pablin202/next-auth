import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function LoggedOutLayout({
    children
}: {
    children: React.ReactNode
}) {

    const session = await auth();

    if (!!session?.user?.id) {
        redirect("/my-account");
    }
    return children

}