import { getActivityByTech } from "@/app/actions/Users";
import Link from "next/link";

export default async function ActivityByTech({ params }: { params: { id: string, page: number }})
{
    const id: number = parseInt((await params).id);
    const page: number = (await params).page;
    const res = (await getActivityByTech(id, page))?.results;
    const nbPages = (await getActivityByTech(id, page))?.nbPages;

    return (
        <div className="w-full mx-auto p-4 md:p-8">

            <div className="flex flex-wrap justify-center gap-2 mb-4">
                {Array.from({ length: nbPages }).map((_, i) => (
                    <Link
                        key={i}
                        href={`/admin/activity/${id}/${i + 1}`}
                        className={`px-3 py-1 rounded-md text-sm 
                            ${page === i ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}
                        `}
                    >
                        {i + 1}
                    </Link>
                ))}
            </div>

            <table className="min-w-max w-full border-collapse">
                <thead className="bg-blue-100 text-blue-700">
                    <tr>
                        <th>Date</th>
                        <th>Type</th>
                        <th>Bilan intervention</th>
                        <th>Lieu d'intervention</th>
                    </tr>
                </thead>

                <tbody className="bg-gray-200">
                    {
                        res.map((r: any, index: number) =>
                        {
                            return (
                                <tr key={index}>
                                    <td>Le { r.date.toLocaleDateString() } à { r.date.toLocaleTimeString() }</td>
                                    <td>{ r.type }</td>
                                    <td>{ r.briefing }</td>
                                    <td>{ r.location }</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}