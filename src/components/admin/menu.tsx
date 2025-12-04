"use client"

import { useState } from "react";
import { ManageTeams } from "./teams";
import { ManageTechs } from "./techs";
import { ManageDevices } from "./devices";
import { ManageOnCalls } from "./oncalls";
import { ManageBreakdowns } from "./breakdowns";

export const MenuAdmin = () =>
{
    const [option, setOption] = useState<number>(0);
    
    return (
        <div>
            {
                option === 0 &&

                <div>
                    <button className="hover:cursor-pointer" onClick={() => setOption(1)}>Personnel</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(2)}>Équipes</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(3)}>Appareils</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(4)}>Pannes</button>
                    <button className="hover:cursor-pointer" onClick={() => setOption(5)}>Astreintes</button>
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

            {
                option === 4 &&

                <ManageBreakdowns />
            }

            {
                option === 5 &&

                <ManageOnCalls />
            }

            <button className="hover:cursor-pointer" onClick={() => setOption(0)}>Retour</button>
        </div>
    )
}