"use client"

import { connectSocket, getSocket } from "@/lib/ws";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export const Navbar = () =>
{
    const [newBreakdown, setNewBreakdown] = useState<any>(null);
    const session = useSession();
    
    useEffect(() =>
    {
        if(session.status === "authenticated")
        {
            connectSocket(session.data.user.id, session.data.user.role);
        }

        const socket = getSocket();
        
        socket?.addEventListener("message", (event) =>
        {
            const parsed = JSON.parse(event.data);

            if (parsed.event === "new_breakdown")
            {
                setNewBreakdown({...parsed});
            }
        });
    }, [session]);
    
    return (
        <>
            <nav>
                <button onClick={async () => await signOut()}>Déconnexion</button>
            </nav>

            {
                newBreakdown &&

                <div>
                    <h1>Nouvelle panne</h1>
                    <p>{newBreakdown.desc}</p>
                    <h2>Type : {newBreakdown.type}</h2>
                    <h2>Adresse : {newBreakdown.location}</h2>
                    <h2>Référence : {newBreakdown.ref}</h2>
                    <button className="hover:cursor-pointer" onClick={() => setNewBreakdown(null)}>OK</button>
                </div>
            }
        </>
    )
}