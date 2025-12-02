"use client"

import { getTeams } from "@/app/actions/teams";
import { getUsers } from "@/app/actions/Users";
import { useEffect, useState } from "react"

export const ManageTeams = () =>
{
    const [teams, setTeams] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [leader, setLeader] = useState<any>(null);
    const [showCreateTeam, setShowCreateTeam] = useState<boolean>(false);

    useEffect(() =>
    {
        const getAllTeams = async () =>
        {
            setTeams(await getTeams());
        }

        const getAllUsers = async () =>
        {
            setUsers(await getUsers());
        }

        getAllTeams();
        getAllUsers();
    }, []);
    
    return (
        <>
            <h1>Liste des équipes</h1>

            <table>
                <thead>
                    <tr>
                        <th>Chef d'équipe</th>
                        <th>Nombre de techniciens</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        teams.map((team: any) =>
                        {
                            return (
                                <tr>
                                    <td>{ team.leader.firstname } { team.leader.lastname }</td>
                                    <td>{ team.techs.length }</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <button className="hover:cursor-pointer" onClick={() => setShowCreateTeam(true)}>Créer une équipe</button>

            {
                showCreateTeam &&

                <div>
                    <datalist id="users">
                        {
                            users.map((user: any) =>
                            {
                                return (
                                    <option key={user.id} value={user.firstname + " " + user.lastname}></option>
                                )
                            })
                        }
                    </datalist>
                    
                    <input type="text" placeholder="Chef d'équipe ?" list="users" />
                </div>
            }
        </>
    )
}