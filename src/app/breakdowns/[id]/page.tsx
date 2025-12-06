import { getBreakdownById } from "@/app/actions/breakdowns";
import { Navbar } from "@/components/navbar";

export default async function TechBreakdown({ params }: { params: { id: string }})
{
    const id: number = parseInt((await params).id);
    const breakdown = await getBreakdownById(id);

    return (
        <>
            <Navbar/>
            PANNE
        </>
    )
}