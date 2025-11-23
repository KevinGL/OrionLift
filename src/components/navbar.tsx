"use client"

import { signOut } from "next-auth/react"

export const Navbar = () =>
{
    return (
        <nav>
            <button onClick={async () => await signOut()}>Déconnexion</button>
        </nav>
    )
}