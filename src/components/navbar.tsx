"use client"

import { getSocket } from "@/app/sockets/sockets";
import { signOut } from "next-auth/react";
import { useEffect, useState } from "react";

export const Navbar = () =>
{
    const [newBreakdown, setNewBreakdown] = useState<any>(null);
    
    useEffect(() =>
    {
        const handler = (data: any) =>
        {
            //console.log("BREAKDOWN:", data);
            setNewBreakdown({
                desc: data.desc,
                type: data.type,
                location: `${data.device.address} ${data.device.zipCode} ${data.device.city}`,
                ref: data.device.ref
            });
        };

        const socket = getSocket();

        socket.on("new_breakdown", handler);

        return () =>
        {
            socket.off("new_breakdown", handler);
        };
    }, []);
    
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
                    <button className="hover:cursor-pointer" onClick={() => setNewBreakdown({})}>OK</button>
                </div>
            }
        </>
    )
}