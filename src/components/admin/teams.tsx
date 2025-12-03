"use client"

import { addTeamDB, getTeamsDB } from "@/app/actions/teams";
import { getUsers } from "@/app/actions/Users";
import { tr } from "@faker-js/faker";
import { useEffect, useState } from "react"

export const ManageTeams = () =>
{
    const sizePage = 20;
    const [nbPages, setNbPages] = useState<number>(1);
    const [page, setPage] = useState<number>(0);
    const [teams, setTeams] = useState<any>([]);
    const [users, setUsers] = useState<any>([]);
    const [leader, setLeader] = useState<number>(0);
    const [showCreateTeam, setShowCreateTeam] = useState<boolean>(false);
    const [techs, setTechs] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");

    useEffect(() =>
    {
        const getAllTeams = async () =>
        {
            setTeams(await getTeamsDB());
        }

        const getAllUsers = async () =>
        {
            const list = await getUsers();
            setUsers(list);
            setNbPages(list.length / sizePage + 1);
        }

        getAllTeams();
        getAllUsers();
    }, []);

    const isInTeam = (id: number): boolean =>
    {
        return techs.findIndex((tech: any) =>
        {
            return tech.id === id;
        }) > -1;
    }

    const updateTeam = (tech: any) =>
    {
        const index: number = techs.findIndex((t: any) =>
        {
            return t.id === tech.id;
        });

        if(index === -1)
        {
            setTechs([...techs, tech]);
        }

        else
        {
            let list = [...techs];
            list.splice(index, 1);
            setTechs([...list]);
        }
    }

    const updateLeader = (id: number) =>
    {
        if(!leader)
        {
            setLeader(id);
        }

        else
        {
            setLeader(0);
        }
    }

    const createTeam = async () =>
    {
        setTechs([]);
        setLeader(0);
        setShowCreateTeam(false);

        if(await addTeamDB(techs, leader))
        {
            setMessage("Équipe créée avec succès");
        }

        else
        {
            setMessage("Une erreur s'est produite");
        }
    }
    
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
                                <tr key={team.id}>
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

                <>
                    <div>
                        {Array.from({ length: nbPages }).map((_, i) => (
                            <span className={"hover:cursor-pointer" + (page === i ? " text-blue-500" : "")} key={i} onClick={() => setPage(i)}>{i + 1} </span>
                        ))}
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>Prénom</th>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Tél</th>
                                <th>Rôle</th>
                            </tr>
                        </thead>

                        <tbody>
                            {
                                users
                                .filter((user: any, index: number) =>
                                {
                                    return index >= page * sizePage && index < (page + 1) * sizePage;
                                })
                                .map((user: any) =>
                                {
                                    return (
                                        <tr key={user.id}>
                                            <td>{ user.firstname }</td>
                                            <td>{ user.lastname }</td>
                                            <td>{ user.email }</td>
                                            <td>{ user.phone }</td>
                                            <td>{ user.role }</td>
                                            <td><input type="checkbox" checked={isInTeam(user.id)} onChange={() => {updateTeam(user)}} /></td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>

                    <div>
                        {Array.from({ length: nbPages }).map((_, i) => (
                            <span className={"hover:cursor-pointer" + (page === i ? " text-blue-500" : "")} key={i} onClick={() => setPage(i)}>{i + 1} </span>
                        ))}
                    </div>

                    <ul>
                        {
                            techs.map((tech: any) =>
                            {
                                return (
                                    <li key={tech.id}>
                                        <span>
                                            {tech.firstname} {tech.lastname}
                                        </span>
                                        <label htmlFor="">Chef d'équipe ?</label>
                                        <input type="checkbox" onChange={() => updateLeader(tech.id)} disabled={leader > 0 && tech.id !== leader} />
                                    </li>
                                )
                            })
                        }
                    </ul>

                    {
                        techs.length > 0 && leader !== null &&
                        
                        <button className="hover:cursor-pointer" onClick={createTeam}>Valider</button>
                    }
                </>
            }

            {
                message !== "" &&

                <div>
                    <p>{ message }</p>
                    <button className="hover:cursor-pointer" onClick={() => setMessage("")}>OK</button>
                </div>
            }
        </>
    )
}