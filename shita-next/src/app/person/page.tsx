"use client";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { fetcher } from "../libs";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import DataTable from "../components/person";
import { PersonModel } from "../types/person";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function Users() {
    const [personList, setPersonList] = useState<PersonModel[]>([]);
    const { data, error } = useSWR<{ result: PersonModel[] }>("/utils/queries/person", fetcher);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedPerson, setSelectedPerson] = useState<PersonModel | null>(null);

    useEffect(() => {
        if (data && data.result) {
            setPersonList(data.result);
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
            setPersonList(personList.filter((person) => person.id !== id));
        }
    };

    const openEditDialog = (person: PersonModel) => {
        setSelectedPerson(person);
        setIsDialogOpen(true);
    };

    const updatePerson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPerson) return;

        const res = await fetch(`/utils/queries/person/${selectedPerson.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selectedPerson),
        });

        const content = await res.json();
        if (content) {
            setIsAlertOpen(true);
            setIsDialogOpen(false);

            setPersonList((prev) =>
                prev.map((p) => (p.id === selectedPerson.id ? selectedPerson : p))
            );
        } else {
            alert(content.message);
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
                    <Button variant="outline" size="sm" onClick={() => openEditDialog(row.original)}>
                        Edit
                    </Button>
                    <Link href={`/person/read/${row.original.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                    </Link>
                </div>
            ),
        },
    ];

    return (
        <div className="container mx-auto py-10">
            <h2 className="text-2xl font-bold text-center mb-5">
                List Person - Counter: {personList.length}
            </h2>
    
            {/* Tombol Create */}
            <div className="flex justify-center">
                <Link href="/person/create">
                    <Button className="mb-4">Create New</Button>
                </Link>
            </div>
    
            <div className="w-full overflow-auto">
                <DataTable columns={columns} data={personList} />
            </div>
    
            {/* Dialog Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Edit Person Data</DialogTitle>
                        <DialogDescription>
                            Make changes to your data here. Click save when youre done.
                        </DialogDescription>
                    </DialogHeader>
    
                    <form onSubmit={updatePerson} className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Name</Label>
                            <Input 
                                id="name" 
                                className="col-span-3" 
                                value={selectedPerson?.name || ""}
                                onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, name: e.target.value } : null)}
                            />
                        </div>
    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Address</Label>
                            <Input 
                                id="address" 
                                className="col-span-3" 
                                value={selectedPerson?.address || ""}
                                onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, address: e.target.value } : null)}
                            />
                        </div>
    
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input 
                                id="phone" 
                                className="col-span-3" 
                                value={selectedPerson?.phone || ""}
                                onChange={(e) => setSelectedPerson(prev => prev ? { ...prev, phone: e.target.value } : null)}
                            />
                        </div>
    
                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
    
            {/* Alert Dialog */}
            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Updated Person Data Successfully</AlertDialogTitle>
                        <AlertDialogDescription>Your changes have been saved.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogAction onClick={() => setIsAlertOpen(false)}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
        
    );
}
