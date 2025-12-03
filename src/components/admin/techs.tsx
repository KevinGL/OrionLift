"use client"

import { getSectors } from "@/app/actions/sectors";
import { getTeamsDB } from "@/app/actions/teams";
import { addUser, getUsers } from "@/app/actions/Users";
import { useEffect, useState } from "react"

export const ManageTechs = () =>
{
    const sizePage = 20;
    const [nbPages, setNbPages] = useState<number>(1);
    const [page, setPage] = useState<number>(0);
    const [users, setUsers] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);
    const [newUser, setNewUser] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [teams, setTeams] = useState<any[]>([]);

    useEffect(() =>
    {
        const getAllUsers = async () =>
        {
            const list = await getUsers();
            setUsers(list);
            setNbPages(list.length / sizePage + 1);
        }

        const getAllSectors = async () =>
        {
            setSectors(await getSectors());
        }

        const getTeams = async () =>
        {
            setTeams(await getTeamsDB());
        }

        getAllUsers();
        getAllSectors();
        getTeams();
    }, []);

    const setFirstname = (value: string) =>
    {
        setNewUser({ ...newUser, firstname: value });
    }

    const setLastname = (value: string) =>
    {
        setNewUser({ ...newUser, lastname: value });
    }

    const setEmail = (value: string) =>
    {
        setNewUser({ ...newUser, email: value });
    }

    const setSector = (value: number) =>
    {
        setNewUser({ ...newUser, sectorRef: value });
    }

    const setRole = (value: string) =>
    {
        setNewUser({ ...newUser, role: value });
    }

    const setPhone = (value: string) =>
    {
        setNewUser({ ...newUser, phone: value });
    }

    const setTeam = (value: number) =>
    {
        setNewUser({ ...newUser, teamId: value });
        console.log(value);
    }
    
    return (
        <>
            <datalist id="sectors">
                {
                    sectors.map((sector: any) =>
                    {
                        return (
                            <option key={sector.id} value={sector.ref}></option>
                        )
                    })
                }
            </datalist>

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
                        <th>Secteur attribué</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        users
                        .filter((_, index: number) =>
                        {
                            return index >= page * sizePage && index < (page + 1) * sizePage;
                        })
                        .map((user: any) =>
                        {
                            return (
                                <tr key={ user.id }>
                                    <td>{ user.firstname }</td>
                                    <td>{ user.lastname }</td>
                                    <td>{ user.email }</td>
                                    <td>{ user.phone }</td>
                                    <td>{ user.role }</td>
                                    <td>{ user.sectorRef }</td>
                                    <td><button className="hover:cursor-pointer">Supprimer</button></td>
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

            <button className="hover:cursor-pointer" onClick={() => setShowForm(true)} >Ajouter un membre</button>

            {
                showForm && 

                <div>
                    <datalist id="teams">
                        {
                            teams.map((team) =>
                            {
                                return (
                                    <option key={team.id} value={team.id}>{"Équipe de " + team.leader.firstname + " " + team.leader.lastname}</option>
                                )
                            })
                        }
                    </datalist>

                    <input type="text" placeholder="Prénom" onChange={(e) => setFirstname(e.target.value)} />
                    <input type="text" placeholder="Nom" onChange={(e) => setLastname(e.target.value)} />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Secteur" list="sectors" onChange={(e) => setSector(parseInt(e.target.value))} />
                    <input type="text" placeholder="Tél" onChange={(e) => setPhone(e.target.value)} />
                    <input type="text" placeholder="Équipe" list="teams" onChange={(e) => setTeam(parseInt(e.target.value))} />

                    <label htmlFor="">Role ?</label>
                    <select name="" id="" onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="tech">Technicien</option>
                    </select>

                    <button className="hover:cursor-pointer" onClick={async() =>
                        {
                            if(await addUser(newUser))
                            {
                                if(newUser.sectorRef)
                                {
                                    setMessage(`Membre assigné au secteur ${newUser.sectorRef}`);
                                }
                                else
                                {
                                    setMessage("Membre ajouté");
                                }
                            }
                            else
                            {
                                setMessage("Une erreur s'est produite");
                            }
                        }}>Valider</button>
                </div>
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