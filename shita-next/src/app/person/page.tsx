"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../libs";
import Link from "next/link";
import { PersonModel } from "../types/person";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/person";

export default function Users() {
    const [person, setUsers] = useState<PersonModel[]>([]);
    const { data, error } = useSWR<{ result: PersonModel[] }>("/utils/queries/person", fetcher);

    useEffect(() => {
        console.log("Data fetched:", data);
        if (data && data.result && Array.isArray(data.result)) {
            setUsers(data.result);
        }
    }, [data]);

    if (error) return <div>Failed to load</div>;

    if (!data) return <div>Loading...</div>;

    const deletePerson = async (id: number) => {
        const res = await fetch(`/utils/queries/person/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

        const content = await res.json();

        if (content.success > 0) {
            setUsers(person.filter((person) => person.id !== id));
        }
        
    };

    const columns: ColumnDef<PersonModel>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "address", header: "Address" },
        { accessorKey: "phone", header: "Phone" },
        {
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-5">
                    <Button variant="destructive" size="sm" onClick={() => deletePerson(row.original.id)}>
                        Delete
                    </Button>
                    <Link href={`/person/edit/${row.original.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Link href={`/person/read/${row.original.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold text-center mb-5">List Person - Counter: {person.length}</h2>
            <div className="flex justify-center">
                <Link href={`/person/create`}>
                    <Button className="mb-4">Create New</Button>
                </Link>
            </div>
            <div className="w-full overflow-auto">
                <DataTable columns={columns} data={person} />
            </div>
        </div>
    );
}

