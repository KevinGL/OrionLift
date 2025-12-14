import { getActivityByTech } from "@/app/actions/Users";

export default async function ActivityByTech({ params }: { params: { id: string }})
{
    const id: number = parseInt((await params).id);
    const res = await getActivityByTech(id);

    return (
        <div className="w-full mx-auto p-4 md:p-8">
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