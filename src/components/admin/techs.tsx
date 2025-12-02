"use client"

import { getSectors } from "@/app/actions/sectors";
import { addUser, getUsers } from "@/app/actions/Users";
import { useEffect, useState } from "react"

export const ManageTechs = () =>
{
    const [users, setUsers] = useState<any[]>([]);
    const [sectors, setSectors] = useState<any[]>([]);
    const [newUser, setNewUser] = useState<any>({});
    const [showForm, setShowForm] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    useEffect(() =>
    {
        const getAllUsers = async () =>
        {
            setUsers(await getUsers());
        }

        const getAllSectors = async () =>
        {
            setSectors(await getSectors());
        }

        getAllUsers();
        getAllSectors();
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
                        users.map((user: any) =>
                        {
                            return (
                                <tr key={ user.id }>
                                    <td>{ user.firstname }</td>
                                    <td>{ user.lastname }</td>
                                    <td>{ user.email }</td>
                                    <td>{ user.phone }</td>
                                    <td>{ user.role }</td>
                                    <td><button className="hover:cursor-pointer">Supprimer</button></td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            <button className="hover:cursor-pointer" onClick={() => setShowForm(true)} >Ajouter un membre</button>

            {
                showForm && 

                <div>
                    <input type="text" placeholder="Prénom" onChange={(e) => setFirstname(e.target.value)} />
                    <input type="text" placeholder="Nom" onChange={(e) => setLastname(e.target.value)} />
                    <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="text" placeholder="Secteur" list="sectors" onChange={(e) => setSector(parseInt(e.target.value))} />
                    <input type="text" placeholder="Tél" onChange={(e) => setPhone(e.target.value)} />

                    <label htmlFor="">Role ?</label>
                    <select name="" id="" onChange={(e) => setRole(e.target.value)}>
                        <option value="admin">Admin</option>
                        <option value="tech">Technicien</option>
                    </select>

                    <button className="hover:cursor-pointer" onClick={async() =>
                        {
                            if(await addUser(newUser))
                            {
                                setMessage(`Technicien assigné au secteur ${newUser.sectorRef}`);
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