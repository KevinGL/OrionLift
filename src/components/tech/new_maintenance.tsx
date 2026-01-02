"use client"

import { getDeviceByToken } from "@/app/actions/tokens";
import { useEffect, useState } from "react"
import { Error } from "@/components/Error";
import { getLocalDateISO } from "@/lib/dates";
import { addMaintenance } from "@/app/actions/maintenances";
import { useRouter } from "next/navigation";

export const NewMaintenance = ({token}: {token: string}) =>
{
    const [device, setDevice] = useState<any>({});
    const [maint, setMaint] = useState<any>({
        beginAt : "",
        phoneAt : "",
        phoneText: "",
        phoneOK: false,
        briefing: "",
        safetyAt: "",
        safety: "",
        wiresAt: "",
        wires: ""
    });

    const [modal, setModal] = useState<string>("");
    const [modal2, setModal2] = useState<string>("");
    const [modalOp, setModalOp] = useState<any>({});

    const operations =
    [
        {
            location: "Palier",
            ops:
            [
                "Afficher le panneau \"Maintenance en cours\""
            ]
        },

        {
            location: "Fosse",
            ops:
            [
                "Contrôle visuel câbles et limiteur de vitesse",
                "Contrôle visuel gaine, récupérateurs d'huile",
                "Contrôle visuel accessoires de sécurité",
                "Contrôle visuel limiteur de vitesse, poulie et contact de tension de câble",
                "Contrôle visuel amortisseurs"
            ]
        },

        {
            location: "Gaine",
            ops:
            [
                "Réglage éclairage",
                "Contrôle visuel / mesures informations de gaine",
                "Contrôle visuel / Nettoyage / Lubrification guides",
                "Éteindre la lumière en gaine"        
            ]
        },

        {
            location: "Machinerie",
            ops:
            [
                "Réglage manoeuvre de rappel",
                "Contrôle visuel fixations machine de traction, niveau, ventilateur, poulie de traction, encodeur",
                "Contrôle visuel freins, pièces mobiles, bruit, contacts",
                "Contrôle visuel limiteur de vitesse",
                "Contrôle visuel suspensions de câbles et contre-poids en haut de gaine",
                "Contrôle visuel poulie, courroies, usure",
                "Contrôle visuel / Réglage indicateur de niveau, contrôle LED",              
                "Éteindre la lumière en machinerie"               
            ]
        },

        {
            location: "Cabine",
            ops:
            [
                "Contrôle visuel / Réglage / Nettoyage boîte à boutons, appel, indications",
                "Contrôle visuel / Nettoyage cabine et diffuseur d'éclairage",
                "Contrôle visuel / Mesures précisions d'arrêt, bruits (Descente et montée)",
                "Contrôle visuel / Nettoyage manoeuvre, couvercle de protection, verrouillage, documentation",
                "Contrôle visuel / Réglage dispositif de secours, sirène, commande bicanal, éclairage de secours, batteries",
                "Contrôle visuel toit de cabine, plate-forme de travail",
                "Réglage manoeuvre d'inspection",
                "Contrôle visuel / Nettoyage / Lubrification coulisseaux, rollers",
                "Contrôle visuel contre-poids, coulisseaux, suspensions",
                "Contrôle visuel cabine, parachute, arcade, poulie tendeuse",
                "Contrôle visuel plaque d'amortisseurs",
                "Contrôle visuel / Réglage / Mesure / Nettoyage entraînement portes, tension courroie, pince, contacts",
                "Contrôle visuel / Réglage / Mesure contact de porte de cabine",
                "Mettre à jour la carte de passage"
            ]
        },

        {
            location: "Portes palières",
            ops:
            [
                "Contrôle visuel / Réglage / Nettoyage portes, galets, patins, rails",
                "Contrôle visuel / Réglage / Mesures contacts KTS, verrouillage de portes, contrôle mécanique et électrique",
                "Contrôle visuel / Nettoyage rails de portes de cabine, patins, galets"
            ]
        },
    ];

    const [validatedOps, setValOps] = useState<string[]>([]); 

    const router = useRouter();
    
    useEffect(() =>
    {
        //console.log(token);
        const getDevice = async () =>
        {
            setDevice(await getDeviceByToken(token));
        }

        getDevice();

        setMaint({
            ...maint,
            beginAt: getLocalDateISO()
        });
    }, []);

    const handleBeginAt = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setMaint({...maint, beginAt: e.target.value});
    }

    const handlePhone = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, phoneText: e.target.value, phoneAt: getLocalDateISO()});
    }

    const handlePhoneOK = (e: React.ChangeEvent<HTMLInputElement>) =>
    {
        setMaint({...maint, phoneOK: e.target.checked, phoneAt: getLocalDateISO()});
    }

    const handleBriefing = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, briefing: e.target.value});
    }

    const handleSafety = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, safety: e.target.value, safetyAt: getLocalDateISO()});
    }

    const handleWires = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    {
        setMaint({...maint, wires: e.target.value, wiresAt: getLocalDateISO()});
    }

    const handleMaint = async () =>
    {
        maint.deviceId = device.id;
        maint.endAt = getLocalDateISO();
        
        //console.log(maint);

        setModal("");

        let nbOps: number = 0;
        for(let i = 0 ; i < operations.length ; i++)
        {
            for(let j = 0 ; j < operations[i].ops.length ; j++)
            {
                nbOps++;
            }
        }

        if(validatedOps.length < nbOps)
        {
            setModal2("Merci de valider toutes les opérations de maintenance");
        }

        else
        {
            if(await addMaintenance(maint))
            {
                router.push("/tech_home");
            }

            else
            {
                setModal2("Une erreur s'est produite");
            }
        }
    }

    const checkOperation = (location: string, index: number) =>
    {
        /*const validated = validatedOps;
        const key: string = `${location}_${index}`;

        const indexOfKey: number = validated.indexOf(key);

        if(indexOfKey === -1)
        {
            validated.push(key);
        }

        else
        {
            validated.splice(indexOfKey, 1);
        }

        setValOps(validated);*/

        setValOps((prev) =>
        {
            const key: string = `${location}_${index}`;

            const indexOfKey: number = prev.indexOf(key);

            if(indexOfKey === -1)
            {
                //prev.push(key);
                prev = [...prev, key];
            }

            else
            {
                //prev.splice(indexOfKey, 1);
                prev = prev.filter((a: string) => {return a !== key});
            }

            return [...prev];
        });
    }

    const isCkecked = (location: string, index: number): boolean =>
    {
        const key: string = `${location}_${index}`;

        return validatedOps.indexOf(key) > -1;
    }

    const isValidatedLocation = (location: string): boolean =>
    {
        const index = operations.findIndex((a) => a.location === location);

        const nbOpsOfLocation = operations[index].ops.length;
        const nbOpsOfLocationValid = validatedOps.filter((a: string) => a.includes(location)).length;

        return nbOpsOfLocation === nbOpsOfLocationValid;
    }

    const validLocation = (location: string) =>
    {
        /*const validated = validatedOps;
        
        for(let i = 0 ; i < operations.length ; i++)
        {
            if(operations[i].location === location)
            {
                for(let j = 0 ; j < operations[i].ops.length ; j++)
                {
                    const key: string = `${location}_${j}`;
                    if(validated.indexOf(key) === -1)
                    {
                        validated.push(key);
                    }
                }
            }
        }

        setValOps(validated);*/

        const toCheck: boolean = !isValidatedLocation(location);

        setValOps((prev) =>
        {
            if(toCheck)
            {
                for(let i = 0 ; i < operations.length ; i++)
                {
                    if(operations[i].location === location)
                    {
                        for(let j = 0 ; j < operations[i].ops.length ; j++)
                        {
                            const key: string = `${location}_${j}`;
                            if(prev.indexOf(key) === -1)
                            {
                                prev = [...prev, key];
                            }
                        }
                    }
                }
            }

            else
            {
                for(let i = 0 ; i < operations.length ; i++)
                {
                    if(operations[i].location === location)
                    {
                        for(let j = 0 ; j < operations[i].ops.length ; j++)
                        {
                            const key: string = `${location}_${j}`;
                            prev = prev.filter((a: string) => {return a !== key});
                        }
                    }
                }
            }
            
            return [...prev];
        });
    }

    return (
        <>
            {
                device !== null &&

                <div className="flex flex-col min-h-screen bg-gradient-to-br from-sky-100 to-blue-200 p-6">
                    <div className="bg-white md:w-4/5 h-min rounded-lg text-center mx-auto border-1 border-black py-5 mb-10">
                        <h1 className="text-xl">{ device.ref }</h1>
                        <h2 className="text-lg">{ device.address } { device.zipCode } { device.city }</h2>
                    </div>

                    <div className="bg-white w-full md:w-4/5 h-min rounded-lg text-center mx-auto border-1 border-black mb-10">
                        <div className="text-md md:text-lg flex flex-col md:flex-row md:justify-around w-1/2 mx-auto mb-5">
                            <label htmlFor="">Début de la maintenance</label>
                            <input type="datetime-local" value={maint.beginAt} onChange={handleBeginAt} />
                        </div>

                        <div className="text-md md:text-lg flex flex-col w-1/2 mx-auto mb-5">
                            <label htmlFor="">Bilan essai téléphonique</label>
                            <textarea className="border-1 border-gray-300 rounded-lg w-full mx-auto p-2" value={maint.phoneText} onChange={handlePhone} />
                        </div>

                        <div className="text-md md:text-lg flex flex-row justify-center md:justify-around w-full md:w-1/4 mx-auto mb-5">
                            <label htmlFor="" className="mr-5 md:mr-0">Téléphone opérationnel ?</label>
                            <input type="checkbox" value={maint.phoneOK} onChange={handlePhoneOK} />
                        </div>

                        <div className="text-md md:text-lg flex flex-col w-1/2 mx-auto mb-5">
                            <label htmlFor="">Bilan global</label>
                            <textarea className="border-1 border-gray-300 rounded-lg w-full mx-auto p-2" value={maint.briefing} onChange={handleBriefing} />
                        </div>
                    </div>

                    <div className="bg-white w-full md:w-4/5 h-min rounded-lg text-center mx-auto border-1 border-black mb-10">
                        <div className="text-md md:text-lg flex flex-col w-1/2 mx-auto mb-5">
                            <label htmlFor="">Bilan essai parachute</label>
                            <textarea className="border-1 border-gray-300 rounded-lg w-full mx-auto p-2" value={maint.safety} onChange={handleSafety} />
                        </div>

                        <div className="text-md md:text-lg flex flex-col w-1/2 mx-auto mb-5">
                            <label htmlFor="">Bilan contrôle câbles</label>
                            <textarea className="border-1 border-gray-300 rounded-lg w-full mx-auto p-2" value={maint.wires} onChange={handleWires} />
                        </div>
                    </div>

                    <div className="bg-white w-full md:w-4/5 h-min rounded-lg text-center mx-auto border-1 border-black mb-10">
                        <label htmlFor="">Opérations</label>
                        <div className="flex flex-col md:flex-row md:flex-wrap justify-evenly">
                            {
                                operations.map((operation: any, index: number) =>
                                {
                                    return (
                                        <button key={index} className="relative border-1 rounded-lg w-4/5 mx-auto my-2 md:w-1/4 py-5 md:mx-2 hover:cursor-pointer bg-gray-100 hover:bg-gray-200"
                                            onClick={() => setModalOp({location: operation.location, ops: operation.ops})}
                                        >
                                            <div>
                                                <h3>{ operation.location }</h3>
                                                {
                                                    isValidatedLocation(operation.location) &&

                                                    <div className="absolute top-0 right-0">
                                                        <img src="/img/check-mark.png" alt="OK" className="w-5 h-5" />
                                                    </div>
                                                }
                                            </div>
                                        </button>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <button className="w-full md:w-1/5 mx-auto bg-green-500 hover:bg-green-600 rounded-lg px-5 py-3 mb-2 text-white hover:cursor-pointer" onClick={() => setModal("Finaliser la maintenance ?")}>Valider la maintenance</button>
                    
                    {
                        modal !== "" &&

                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white w-4/5 sm:w-1/2 p-6 rounded-lg shadow-lg">
                                <p>
                                    { modal }
                                </p>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button onClick={handleMaint} className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer">Oui</button>
                                    <button onClick={() => setModal("")} className="px-4 py-2 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 hover:cursor-pointer">Non</button>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        modal2 !== "" &&

                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white w-4/5 sm:w-1/2 p-6 rounded-lg shadow-lg">
                                <p>
                                    { modal2 }
                                </p>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button onClick={() => setModal2("")} className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer">OK</button>
                                </div>
                            </div>
                        </div>
                    }

                    {
                        Object.keys(modalOp).length > 0 &&

                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white w-4/5 sm:w-1/2 p-6 rounded-lg shadow-lg">
                                <ul>
                                    {
                                        modalOp.ops.map((op: any, index: number) =>
                                        {
                                            const ckecked = isCkecked(modalOp.location, index);
                                            
                                            return (
                                                <li key={index}>
                                                    <input type="checkbox" className="mr-3" checked={ckecked} onChange={() => checkOperation(modalOp.location, index)} />
                                                    { op }
                                                </li>
                                            )
                                        })
                                    }
                                </ul>

                                <div className="mt-4 flex justify-end gap-2">
                                    <button onClick={() => validLocation(modalOp.location)} className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer">
                                        {
                                            !isValidatedLocation(modalOp.location) && <>Cocher toutes les opérations</>
                                        }

                                        {
                                            isValidatedLocation(modalOp.location) && <>Décocher toutes les opérations</>
                                        }
                                    </button>
                                    <button onClick={() => setModalOp({})} className="px-4 py-2 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 hover:cursor-pointer">OK</button>
                                </div>
                            </div>
                        </div>
                    }
                </div>
            }

            {
                !device &&

                <Error />
            }
        </>
    )
}