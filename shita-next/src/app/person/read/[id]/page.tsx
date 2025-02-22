'use client'
import { fetcher } from '@/app/libs'
import { use } from 'react';
import useSWR from 'swr';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function Detail({ params }: { params: Promise<{ id: number }> }) {
    const resolvedParams = use(params);
    const { data: person, isLoading, error } = useSWR(`/utils/queries/person/${resolvedParams.id}`, fetcher);
    const router = useRouter();

    if (isLoading) return <div><span>Loading...</span></div>;
    if (error) return <div><span>Error fetching data</span></div>;
    if (!person) return <div><span>No user found</span></div>;

    if (person) {
        console.info("Person Data: ", person)
    }

    return (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className='font-bold py-2 block text-2xl text-center mb-5'>View Person Data</span>
            <Card className="w-[450px]">
                <CardHeader></CardHeader>

                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" value={person.name} readOnly />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="address">Address</Label>
                                <Input id="address" value={person.address} readOnly />
                            </div>

                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={person.phone} readOnly />
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-between">
                    <Button onClick={() => router.push("/person")}>Close</Button>
                </CardFooter>
            </Card>
        </div>
        
    );
}
