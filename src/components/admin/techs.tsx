"use client"

import { getSectorsDB } from "@/app/actions/sectors";
import { getTeamsDB } from "@/app/actions/teams";
import { addUser, getUsers } from "@/app/actions/Users";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

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

    const router = useRouter();

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
            setSectors(await getSectorsDB());
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
        <div className="w-full mx-auto p-4 md:p-8">

            {/* Pagination top */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Array.from({ length: nbPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded-md text-sm 
                            ${page === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}
                        `}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Table container (scrollable on mobile) */}
            <div className="w-full overflow-x-auto">
                <table className="min-w-max w-full border-collapse">
                    <thead className="bg-blue-100 text-blue-700">
                        <tr>
                            <th className="px-4 py-2">Prénom</th>
                            <th className="px-4 py-2">Nom</th>
                            <th className="px-4 py-2">Email</th>
                            <th className="px-4 py-2">Tél</th>
                            <th className="px-4 py-2">Rôle</th>
                            <th className="px-4 py-2">Secteur</th>
                            <th className="px-4 py-2">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users
                            .slice(page * sizePage, (page + 1) * sizePage)
                            .map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="px-4 py-2">{user.firstname}</td>
                                    <td className="px-4 py-2">{user.lastname}</td>
                                    <td className="px-4 py-2">{user.email}</td>
                                    <td className="px-4 py-2">{user.phone}</td>
                                    <td className="px-4 py-2">{user.role}</td>
                                    <td className="px-4 py-2">{user.sectorRef ?? "-"}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button
                                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md text-sm"
                                            onClick={() => router.push(`/admin/activity/${user.id}`)}
                                        >
                                            Activité
                                        </button>
                                        <button className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md text-sm">
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination bottom */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
                {Array.from({ length: nbPages }).map((_, i) => (
                    <button
                        key={i}
                        onClick={() => setPage(i)}
                        className={`px-3 py-1 rounded-md text-sm 
                            ${page === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}
                        `}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>

            {/* Add User */}
            <div className="mt-6 flex justify-center">
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                    onClick={() => setShowForm(true)}
                >
                    + Ajouter un membre
                </button>
            </div>

            {/* Add user form */}
            {showForm && (
                <div className="mt-6 p-6 bg-white shadow-md rounded-lg max-w-xl mx-auto">

                    <h2 className="text-xl font-semibold text-blue-600 mb-4">Créer un membre</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="input" placeholder="Prénom" onChange={(e) => setFirstname(e.target.value)} />
                        <input className="input" placeholder="Nom" onChange={(e) => setLastname(e.target.value)} />
                        <input className="input" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                        <input className="input" placeholder="Téléphone" onChange={(e) => setPhone(e.target.value)} />

                        {/* Secteur */}
                        <input list="sectors" className="input" placeholder="Secteur"
                            onChange={(e) => setSector(Number(e.target.value))}
                        />
                        <datalist id="sectors">
                            {sectors.map((s) => (
                                <option key={s.id} value={s.ref} />
                            ))}
                        </datalist>

                        {/* Équipe */}
                        <input list="teams" className="input" placeholder="Équipe"
                            onChange={(e) => setTeam(Number(e.target.value))}
                        />
                        <datalist id="teams">
                            {teams.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {`Équipe de ${t.leader.firstname} ${t.leader.lastname}`}
                                </option>
                            ))}
                        </datalist>

                        {/* Rôle */}
                        <select className="input" onChange={(e) => setRole(e.target.value)}>
                            <option value="tech">Technicien</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button
                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={async () => {
                            if (await addUser(newUser))
                            {
                                setMessage("Utilisateur ajouté !");
                                setShowForm(false);
                            }
                            else
                            {
                                setMessage("Erreur lors de l’ajout.");
                            }
                        }}>
                        Valider
                    </button>

                    <button
                        className="mt-4 w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                        onClick={async () => setShowForm(false)}>
                        Annuler
                    </button>
                </div>
            )}

            {/* Message modal */}
            {message && (
                <div className="mt-4 flex flex-col items-center">
                    <p className="text-blue-600 font-medium">{message}</p>
                    <button className="mt-2 px-4 py-1 bg-gray-200 rounded hover:bg-gray-300"
                        onClick={() => setMessage("")}
                    >
                        OK
                    </button>
                </div>
            )}
        </div>
    );
}