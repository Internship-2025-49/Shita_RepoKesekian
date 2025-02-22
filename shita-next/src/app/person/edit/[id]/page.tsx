"use client";
import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { fetcher } from "@/app/libs";
import useSWR from "swr";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { 
    AlertDialog, 
    AlertDialogAction, 
    AlertDialogCancel, 
    AlertDialogContent, 
    AlertDialogDescription, 
    AlertDialogFooter, 
    AlertDialogHeader, 
    AlertDialogTitle 
} from '@/components/ui/alert-dialog';

export default function PostEdit({ params }: { params: Promise<{ id: number }> }) {
    const router = useRouter();
    const resolvedParams = use(params);

    const { data: person, isLoading, error } = useSWR(`/utils/queries/person/${resolvedParams.id}`, fetcher);
    const [name, setName] = useState<string>("");
    const [address, setAddress] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isAlertOpen, setIsAlertOpen] = useState(false);

    useEffect(() => {
        if (person?.result) {
            setName(person.result.name);
            setAddress(person.result.address);
            setPhone(person.result.phone);
        }
    }, [person, isLoading]);

    const updatePerson = async (e: React.FormEvent) => {
        e.preventDefault();
        if (name !== "" && address !== "" && phone !== "") {
            const formData = { name, address, phone };
            const res = await fetch(`/utils/queries/person/${resolvedParams.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const content = await res.json();

            console.log("Form Data: ", formData);
            console.log("content", content);

            if (content) {
                setIsAlertOpen(true);
            } else {
                alert(content.message);
            }
        }
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading person data.</div>;
    if (!person) return <div>Error page.</div>;

    return (
        <>
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
                                value={name} 
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="address" className="text-right">Address</Label>
                            <Input 
                                id="address" 
                                className="col-span-3" 
                                value={address} 
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </div>

                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="phone" className="text-right">Phone</Label>
                            <Input 
                                id="phone" 
                                className="col-span-3" 
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>

                        <DialogFooter>
                            <Button type="submit">Save changes</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Updated Person Data Successfully</AlertDialogTitle>
                        <AlertDialogDescription>Your changes have been saved.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            setIsAlertOpen(false);
                            router.push("/person");
                        }}>Close</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
