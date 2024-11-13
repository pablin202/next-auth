import Link from "next/link";
import React from "react";
import LogoutButton from "./logout-button";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoggedInLayout({
    children
}: {
    children: React.ReactNode
}) {

    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="bg-gray-200 p-4 flex justify-between items-center">
                <ul className="flex gap-4">
                    <li>
                        <Link href="/my-account">My Account</Link>
                    </li>

                    <li>
                        <Link href="/change-password">Change Password</Link>
                    </li>
                </ul>
                <div>
                    <LogoutButton />
                </div>
            </nav>
            <div className="flex-1 flex justify-center items-center">
                {children}
            </div>
        </div>
    );
}