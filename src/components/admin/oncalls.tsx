"use client"

import { getOnCallsByTeam } from "@/app/actions/oncalls";
import { getTeamsDB } from "@/app/actions/teams";
import { table } from "console";
import { useEffect, useState } from "react"

export const ManageOnCalls = () =>
{
    const [teams, setTeams] = useState<any[]>([]);
    const [onCalls, setOnCalls] = useState<any[]>([]);

    useEffect(() =>
    {
        const getTeams = async () =>
        {
            setTeams(await getTeamsDB());
        }

        getTeams();
    }, []);

    const getOnCallsOfTeam = async (team: any) =>
    {
        setOnCalls(await getOnCallsByTeam(team));
    }

    return (
        <>
            <h1>Définir / Mettre à jour le planning des astreintes pour l'équipe :</h1>

            <ul>
                {
                    teams.map((team: any) =>
                    {
                        return (
                            <li key={team.id}><button className="hover:cursor-pointer" onClick={() => getOnCallsOfTeam(team.id)}>Équipe de { team.leader.firstname } { team.leader.lastname }</button></li>
                        )
                    })
                }
            </ul>

            {
                onCalls.length > 0 &&

                <table>
                    <thead></thead>
                </table>
            }
        </>
    )
}