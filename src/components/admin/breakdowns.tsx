"use client"

import { addBreakdownDB, getBreakdownsByDeviceDB, getBreakdownsBySectorDB } from "@/app/actions/breakdowns";
import { getDevicesDB } from "@/app/actions/devices";
import { getSectorsDB } from "@/app/actions/sectors";
import { getTechsDB } from "@/app/actions/Users";
import { getSocket } from "@/lib/ws";
import { useEffect, useState } from "react";

export const ManageBreakdowns = () =>
{
    const [sectors, setSectors] = useState<any[]>([]);
    const [techs, setTechs] = useState<any[]>([]);
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [devices, setDevices] = useState<any[]>([]);
    const [showInputDevice, setShowInputDevice] = useState<boolean>(false);
    const [ref, setRef] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showCreateBr, setShowCreateBr] = useState<boolean>(false);
    const [breakdown, setBreakdown] = useState<any>({type: "ASCBLQ"});

    useEffect(() =>
    {
        const getDevices = async () =>
        {
            setDevices(await getDevicesDB());
        }

        const getTechs = async () =>
        {
            setTechs(await getTechsDB());
        }

        getDevices();
        getTechs();
    }, []);

    const getSectors = async () =>
    {
        setSectors(await getSectorsDB());
    }

    const getBySector = async (id: number) =>
    {
        setBreakdowns(await getBreakdownsBySectorDB(id));
    }

    const getByDevice = async () =>
    {
        setBreakdowns([]);
        
        const list = await getBreakdownsByDeviceDB(ref);

        if(!list.length)
        {
            setMessage("Appareil introuvable");
        }
        else
        {
            setBreakdowns(list);
        }
    }

    const setDevice = (value: string) =>
    {
        //console.log(value);

        const device = devices.find((d: any) =>
        {
            return d.id === parseInt(value) || d.ref === value;
        });

        if(device)
        {
            setBreakdown({...breakdown, device});
        }
    }

    const setTech = (value: string) =>
    {
        const tech = techs.find((t: any) =>
        {
            return `${t.firstname} ${t.lastname}` === value;
        });

        if(tech)
        {
            setBreakdown({...breakdown, user: tech});
        }
    }

    const setDescription = (value: string) =>
    {
        setBreakdown({...breakdown, description: value});
    }

    const setType = (value: string) =>
    {
        setBreakdown({...breakdown, type: value});
    }

    const createBreakDown = async () =>
    {
        const breakdownDB =
        {
            createdAt: new Date(),
            takenAt: null,
            beginAt: null,
            endAt: null,
            briefing: "",
            description: breakdown.description,
            type: breakdown.type,

            device: { connect: { id: breakdown.device.id } },
            user: { connect: { id: breakdown.user.id } }
        };

        if(await addBreakdownDB(breakdownDB))
        {
            const socket = getSocket();
            
            socket?.send(JSON.stringify({
                event: "new_breakdown",
                tech: breakdown.user.id,
                desc: breakdown.description,
                type: breakdown.type,
                ref: breakdown.device.ref,
                location: `${breakdown.device.address} ${breakdown.device.zipCode} ${breakdown.device.city}`
            }));
            
            setMessage("Panne créée");
        }
        else
        {
            setMessage("Une erreur s'est produite");
        }
    }

    return (
        <div className="p-4 md:p-8 space-y-6">

            <datalist id="devices">
                {
                    devices.map((device: any) =>
                    {
                        return <option key={device.id} value={device.id}>{device.ref} (Secteur {device.sector.ref})</option>
                    })
                }
            </datalist>

            <datalist id="techs">
                {
                    techs.map((tech: any) =>
                    {
                        return <option key={tech.id} value={`${tech.firstname} ${tech.lastname}`}>{`${tech.firstname} ${tech.lastname} (Secteur ${tech.sector.ref})`}</option>
                    })
                }
            </datalist>

            {/* ACTION BAR */}
            <div className="flex flex-wrap gap-3">
                <button 
                    onClick={() =>
                        {
                            setBreakdowns([]);
                            getSectors();
                            setShowInputDevice(false);
                            setShowCreateBr(false);
                        }
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                >
                    Historique par secteur
                </button>

                <button 
                    onClick={() =>
                        {
                            setBreakdowns([]);
                            setShowInputDevice(true);
                            setSectors([]);
                            setShowCreateBr(false);
                        }
                    }
                    className="px-4 py-2 bg-blue-500 text-white rounded-md shadow hover:bg-blue-600 transition"
                >
                    Historique par appareil
                </button>

                <button 
                    onClick={() =>
                        {
                            setBreakdowns([]);
                            setShowCreateBr(true);
                            setShowInputDevice(false);
                            setSectors([]);
                        }
                    }
                    className="px-4 py-2 bg-green-500 text-white rounded-md shadow hover:bg-green-600 transition"
                >
                    Créer une panne
                </button>
            </div>

            {/* RECHERCHE PAR APPAREIL */}
            {showInputDevice && (
                <div className="bg-white shadow rounded-md p-4 space-y-3 max-w-md">
                    <input 
                        type="text" 
                        list="devices" 
                        className="w-full border rounded p-2"
                        placeholder="Réf / ID appareil"
                        onChange={(e) => setRef(e.target.value)}
                    />
                    <div className="flex gap-3">
                        <button 
                            onClick={getByDevice}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Valider
                        </button>
                        <button 
                            onClick={() => setShowInputDevice(false)}
                            className="flex-1 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            )}

            {/* LISTE SECTEURS */}
            {sectors.length > 0 && (
                <div className="bg-white shadow rounded-md p-4">
                    <ul className="space-y-2">
                        {sectors.map((s) => (
                            <li key={s.id}>
                                <button 
                                    onClick={() => getBySector(s.id)}
                                    className="text-blue-600 hover:underline"
                                >
                                    Secteur {s.ref}
                                </button>
                            </li>
                        ))}
                    </ul>

                    <button 
                        onClick={() => setSectors([])}
                        className="mt-3 px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Annuler
                    </button>
                </div>
            )}

            {/* TABLEAU PANNE RESPONSIVE */}
            {breakdowns.length > 0 && (
                <div className="overflow-x-auto bg-white shadow rounded-md">
                    <table className="w-full min-w-[900px] text-sm">
                        <thead className="bg-gray-100 text-gray-700">
                            <tr>
                                <th className="p-2 text-left">Créée le</th>
                                <th className="p-2 text-left">Prise en charge</th>
                                <th className="p-2 text-left">Traitée</th>
                                <th className="p-2 text-left">Clôturée</th>
                                <th className="p-2 text-left">Technicien</th>
                                <th className="p-2 text-left">Appareil</th>
                                <th className="p-2 text-left">Bilan</th>
                                <th className="p-2 text-left">Astreinte</th>
                            </tr>
                        </thead>

                        <tbody>
                            {breakdowns.map((b) => (
                                <tr key={b.id} className="border-t">
                                    <td className="p-2">{new Date(b.createdAt).toLocaleString()}</td>
                                    <td className="p-2">{b.takenAt ? new Date(b.takenAt).toLocaleString() : "—"}</td>
                                    <td className="p-2">{b.beginAt ? new Date(b.beginAt).toLocaleString() : "—"}</td>
                                    <td className="p-2">{b.endAt ? new Date(b.endAt).toLocaleString() : "—"}</td>
                                    <td className="p-2">{b.user.firstname} {b.user.lastname}</td>
                                    <td className="p-2">{b.device.ref}</td>
                                    <td className="p-2">{b.briefing || "—"}</td>
                                    <td className="p-2">{b.oncall ? "Oui" : "Non"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* FORMULAIRE CREATION PANNE */}
            {showCreateBr && (
                <div className="bg-white shadow-lg rounded-md p-6 max-w-xl mx-auto space-y-4">

                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Créer une panne</h2>

                    <div className="grid grid-cols-1 gap-3">

                        <div>
                            <label className="text-sm font-medium text-gray-600">Appareil</label>
                            <input type="text" list="devices" 
                                className="w-full border rounded p-2"
                                onChange={(e) => setDevice(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Technicien</label>
                            <input type="text" list="techs" 
                                className="w-full border rounded p-2"
                                onChange={(e) => setTech(e.target.value)} 
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Description</label>
                            <textarea 
                                className="w-full border rounded p-2"
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium text-gray-600">Type de panne</label>
                            <select 
                                onChange={(e) => setType(e.target.value)}
                                className="w-full border rounded p-2"
                            >
                                <option value="ASCBLQ">Ascenseur bloqué</option>
                                <option value="ASCBRU">Ascenseur bruyant</option>
                                <option value="PBETAG">Problème à un étage</option>
                                <option value="OBJFOS">Objet en fosse</option>
                                <option value="PERSBLQ">Personne(s) bloquée(s)</option>
                            </select>
                        </div>

                        <div className="flex gap-3 mt-4">
                            <button 
                                onClick={createBreakDown}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Valider
                            </button>

                            <button 
                                onClick={() => setShowCreateBr(false)}
                                className="flex-1 px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
                            >
                                Annuler
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MESSAGE MODAL */}
            {message !== "" && (
                <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
                    <div className="bg-white rounded-lg shadow p-6 text-center space-y-4 max-w-sm">
                        <p>{message}</p>
                        <button 
                            onClick={() =>
                                {
                                    setMessage("");
                                    setShowCreateBr(false);
                                }
                            }
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}