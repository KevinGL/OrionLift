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
            {/*<nav>
                <button onClick={async () => await signOut()}>Déconnexion</button>
            </nav>*/}

            {
                newBreakdown && (
                    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">

                        <div className="bg-gradient-to-b from-slate-100 to-sky-100 
                                        rounded-xl shadow-2xl p-6 w-full max-w-md 
                                        animate-fade-in">

                            <h1 className="text-2xl font-bold text-slate-800 mb-4 text-center">
                                🚨 Nouvelle panne détectée
                            </h1>

                            <p className="text-slate-700 mb-4 text-center italic">
                                "{newBreakdown.desc}"
                            </p>

                            <div className="space-y-2 text-slate-800">
                                <p><span className="font-semibold">Type :</span> {newBreakdown.type}</p>
                                <p><span className="font-semibold">Adresse :</span> {newBreakdown.location}</p>
                                <p><span className="font-semibold">Référence :</span> {newBreakdown.ref}</p>
                            </div>

                            <button
                                onClick={() => setNewBreakdown(null)}
                                className="w-full mt-6 py-2 rounded-lg font-semibold 
                                        bg-sky-500 text-white hover:bg-sky-600 
                                        transition-all duration-200 shadow-md hover:shadow-lg">
                                OK
                            </button>
                        </div>
                    </div>
                )
            }
        </>
    )
}