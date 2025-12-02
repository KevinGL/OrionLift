"use client"

import { useState } from "react";
import { ManageTeams } from "./teams";
import { ManageTechs } from "./techs";
import { ManageDevices } from "./devices";

export const MenuAdmin = () =>
{
    const [option, setOption] = useState<number>(0);
    
    return (
        <div>
            {
                option === 0 &&

                <div>
                    <button className="hover:cursor-pointer" onClick={() => setOption(1)}>Techniciens</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(2)}>Équipes</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(3)}>Appareils</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(4)}>Astreintes</button>
                </div>
            }

            {
                option === 1 &&

                <ManageTechs />
            }

            {
                option === 2 &&

                <ManageTeams />
            }

            {
                option === 3 &&

                <ManageDevices />
            }

            <button className="hover:cursor-pointer" onClick={() => setOption(0)}>Retour</button>
        </div>
    )
}