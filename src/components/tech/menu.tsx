"use client";

import { useState } from "react";
import { Wrench, AlertTriangle, Calendar, PhoneForwarded, ArrowLeft, LogOut } from "lucide-react";
import { Maintenances } from "@/components/maintenances";
import { Breakdowns } from "./breakdowns";
import { signOut } from "next-auth/react";

export const MenuTech = () =>
{
    const [option, setOption] = useState<number>(0);

    return (
        <div className="min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">

            {/* Écran principal */}
            {option === 0 && (
                <div className="max-w-xl mx-auto">
                    <h1 className="text-2xl font-semibold text-center text-gray-700 mb-6">
                        Tableau de bord technicien
                    </h1>

                    <div className="grid grid-cols-2 gap-6">

                        {/* Maintenances */}
                        <button
                            onClick={() => setOption(1)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <Wrench className="w-10 h-10 text-blue-600 mb-2" />
                            <span className="text-gray-700 font-medium">Maintenances</span>
                        </button>

                        {/* Pannes */}
                        <button
                            onClick={() => setOption(2)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <AlertTriangle className="w-10 h-10 text-red-500 mb-2" />
                            <span className="text-gray-700 font-medium">Pannes</span>
                        </button>

                        {/* Agenda */}
                        <button
                            onClick={() => setOption(3)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <Calendar className="w-10 h-10 text-green-600 mb-2" />
                            <span className="text-gray-700 font-medium">Agenda</span>
                        </button>

                        {/* Astreintes */}
                        <button
                            onClick={() => setOption(4)}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <PhoneForwarded className="w-10 h-10 text-purple-600 mb-2" />
                            <span className="text-gray-700 font-medium">Astreintes</span>
                        </button>

                        {/* Signout */}
                        <button
                            onClick={async () => await signOut()}
                            className="flex flex-col items-center p-6 bg-white shadow-md rounded-xl hover:bg-blue-50 hover:shadow-lg transition"
                        >
                            <LogOut className="w-10 h-10 text-purple-600 mb-2" />
                            <span className="text-gray-700 font-medium">Déconnexion</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Maintenances */}
            {option === 1 && (
                <div className="max-w-3xl mx-auto">
                    <Maintenances />
                    <button
                        onClick={() => setOption(0)}
                        className="flex items-center gap-2 mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>
            )}

            {/* Pannes */}
            {option === 2 && (
                <div className="max-w-3xl mx-auto">
                    <Breakdowns />
                    <button
                        onClick={() => setOption(0)}
                        className="flex items-center gap-2 mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Retour
                    </button>
                </div>
            )}
        </div>
    );
};
