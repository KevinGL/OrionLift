import { getBreakdownsByTechDB, setTaken } from "@/app/actions/breakdowns";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const Breakdowns = () =>
{
    const [breakdowns, setBreakdowns] = useState<any[]>([]);
    const [message, setMessage] = useState<string>("");
    const router = useRouter();
    
    useEffect(() =>
    {
        const getBreakdowns = async () =>
        {
            setBreakdowns(await getBreakdownsByTechDB());
        }

        getBreakdowns();
    }, []);

    const takeBreakdown = async (b: any, index: number) =>
    {
        if(await setTaken(b.id))
        {
            const br = [...breakdowns];
            br[index].takenAt = Date.now();
            setBreakdowns(br);
            setMessage(`Prise en charge effectuée le ${(new Date().toLocaleDateString())} à ${(new Date().toLocaleTimeString())}`);
        }

        else
        {
            setMessage("Une erreur s'est produite");
        }
    }

    return (
        <>
            <table>
                <thead>
                    <tr>
                        <th>Appareil</th>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Statut</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {
                        breakdowns.map((b: any, index: number) =>
                        {
                            return (
                                <tr key={b.id}>
                                    <td>{b.device.ref}</td>
                                    <td>Le {b.createdAt.toLocaleDateString()} à {b.createdAt.toLocaleTimeString()}</td>
                                    <td>{b.type}</td>
                                    <td>
                                        {
                                            !b.takenAt &&

                                            <>
                                                Non pris en charge
                                            </>
                                        }

                                        {
                                            b.takenAt && !b.beginAt &&

                                            <>
                                                Non traitée
                                            </>
                                        }

                                        {
                                            b.takenAt && b.beginAt && !b.endAt &&

                                            <>
                                                Non finalisée
                                            </>
                                        }
                                    </td>
                                    <td>
                                        {
                                            !b.takenAt &&

                                            <button className="hover:cursor-pointer" onClick={() => takeBreakdown(b, index)}>Prendre en charge</button>
                                        }

                                        {
                                            b.takenAt && !b.beginAt &&

                                            <button className="hover:cursor-pointer">Commencer</button>
                                        }

                                        {
                                            b.takenAt && b.beginAt && !b.endAt &&

                                            <button className="hover:cursor-pointer">Reprendre</button>
                                        }
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>

            {
                message !== "" &&

                <div>
                    <p>{message}</p>
                    <button onClick={() => setMessage("")}>OK</button>
                </div>
            }
        </>
    )
}