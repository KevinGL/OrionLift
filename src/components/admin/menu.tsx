"use client"

import { useState } from "react";
import { ManageTeams } from "./teams";
import { ManageTechs } from "./techs";
import { ManageDevices } from "./devices";
import { ManageOnCalls } from "./oncalls";
import { ManageBreakdowns } from "./breakdowns";
import { signOut } from "next-auth/react";

export const MenuAdmin = () =>
{
    const [option, setOption] = useState<number>(1);
    const [open, setOpen] = useState<boolean>(false);

    const menuItems =
    [
        { id: 1, label: "Personnel" },
        { id: 2, label: "Équipes" },
        { id: 3, label: "Appareils" },
        { id: 4, label: "Pannes" },
        { id: 5, label: "Astreintes" }
    ];
    
    return (
        <div className="flex min-h-screen bg-gradient-to-br from-sky-100 to-blue-200">
            
            <aside className={`
                bg-white shadow-md p-4 w-64 flex flex-col gap-4
                fixed md:static inset-y-0 left-0 transform
                ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
                transition-transform duration-300 z-50
            `}>
                <h2 className="text-xl font-semibold text-blue-600 mb-4">Admin</h2>

                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => { setOption(item.id); setOpen(false); }}
                        className={`px-3 py-2 text-left rounded-md
                            ${option === item.id 
                                ? "bg-blue-500 text-white" 
                                : "bg-gray-100 text-gray-700 hover:bg-blue-100"}
                        `}
                    >
                        {item.label}
                    </button>
                ))}

                <button onClick={async () => await signOut()} className="px-3 py-2 text-left rounded-md bg-gray-100 text-gray-700 hover:bg-blue-100">
                    Déconnexion
                </button>

                <button
                    className="mt-auto bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 py-2 rounded-md"
                    onClick={() => setOption(0)}
                >
                    Retour
                </button>
            </aside>

            <button
                className="md:hidden fixed top-4 left-4 bg-blue-500 text-white p-2 rounded-md shadow-md z-50"
                onClick={() => setOpen(!open)}
            >
                ☰
            </button>

            <main className="flex-1 p-6 ml-0 md:ml-64">
                
                {
                    option === 0 &&

                    <div className="text-center mt-10 text-gray-500 text-lg">
                        Choisissez une section dans le menu.
                    </div>
                }

                {option === 1 && <ManageTechs />}
                {option === 2 && <ManageTeams />}
                {option === 3 && <ManageDevices />}
                {option === 4 && <ManageBreakdowns />}
                {option === 5 && <ManageOnCalls />}
                
            </main>
        </div>
    );
}