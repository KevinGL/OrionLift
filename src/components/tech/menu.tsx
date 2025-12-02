"use client"

import { Maintenances } from "@/components/maintenances";
import { useState } from "react";

export const MenuTech = () =>
{
    const [option, setOption] = useState<number>(0);
    
    return (
        <div>
            {
                option === 0 &&

                <div>
                    <button className="hover:cursor-pointer" onClick={() => setOption(1)}>Maintenances</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(2)}>Pannes</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(3)}>Agenda</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(4)}>Astreintes</button>
                </div>
            }

            {
                option === 1 &&

                <>
                    <Maintenances />
                    <button className="hover:cursor-pointer" onClick={() => setOption(0)}>Retour</button>
                </>
            }
        </div>
    )
}