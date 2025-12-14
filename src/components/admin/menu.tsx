"use client"

import { useState } from "react";
import { ManageTeams } from "./teams";
import { ManageTechs } from "./techs";
import { ManageDevices } from "./devices";
import { ManageOnCalls } from "./oncalls";
import { ManageBreakdowns } from "./breakdowns";
import { signOut } from "next-auth/react";
import { Users, PersonStanding, Siren, PhoneForwarded, ArrowLeft, LogOut, Settings } from "lucide-react";

export const MenuAdmin = () =>
{
    const [option, setOption] = useState<number>(0);
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
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
            {
                option === 0 &&

                <div className="max-w-xl mx-auto">
                    <div className="grid grid-cols-2 gap-6">
                        <button
                            onClick={() => setOption(1)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <PersonStanding className="w-10 h-10 text-blue-600 mb-2" />
                            <span className="text-gray-700 font-medium">Personnel</span>
                        </button>

                        <button
                            onClick={() => setOption(2)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <Users className="w-10 h-10 text-red-600 mb-2" />
                            <span className="text-gray-700 font-medium">Équipes</span>
                        </button>

                        <button
                            onClick={() => setOption(3)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <Settings className="w-10 h-10 text-green-600 mb-2" />
                            <span className="text-gray-700 font-medium">Appareils</span>
                        </button>

                        <button
                            onClick={() => setOption(4)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <Siren className="w-10 h-10 text-indigo-600 mb-2" />
                            <span className="text-gray-700 font-medium">Pannes</span>
                        </button>

                        <button
                            onClick={() => setOption(5)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <PhoneForwarded className="w-10 h-10 text-orange-600 mb-2" />
                            <span className="text-gray-700 font-medium">Astreintes</span>
                        </button>

                        <button
                            onClick={async () => await signOut()}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <LogOut className="w-10 h-10 text-purple-600 mb-2" />
                            <span className="text-gray-700 font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            }

            {
                option > 0 &&

                <button
                    onClick={() => setOption(0)}
                    className="flex flex-col items-center p-6 bg-blue-500 text-white shadow-md rounded-xl hover:bg-blue-600 hover:shadow-lg transition"
                >
                    Retour
                </button>
            }

            {option === 1 && <ManageTechs />}
            {option === 2 && <ManageTeams />}
            {option === 3 && <ManageDevices />}
            {option === 4 && <ManageBreakdowns />}
            {option === 5 && <ManageOnCalls />}                
        </div>
    );
}