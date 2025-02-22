/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useState } from 'react';
import * as React from "react"
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';


export default function PersonCreate() {
    const router = useRouter();
    const [name, setName] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    
    const addPerson = async (e: any) => {
        e.preventDefault();

        if (address !== "" && name !== "" && phone !== "") {
            
            const formData = {
                name: name,
                address: address,
                phone: phone,
            };

            const add = await fetch('/utils/queries/person', {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const content = await add.json();
            
            console.log("Form Data: ", formData);
            console.log("content", content);

            if (content) {
                router.push("/person");
                alert("data sudah berhasil dibuat");
              } else {
                alert(content.message);
              }
        }
    };
    
    return (
        // <div className="container mx-auto py-10">
        //     <form className='w-full' onSubmit={addPerson}>
        //         <span className='font-bold py-2 block text-2xl text-center'>Add Data Person</span>
        //         <div className='w-full py-2'>
        //             <label htmlFor="" className='text-sm font-bold py-2 block'>Name</label>
        //             <input type='text' name='name' className='w-full border-[1px] border-grey-200 p-2 rounded-sm' placeholder='Name' onChange={(e: any) => setName(e.target.value)} />
        //         </div>
        //         <div className='w-full py-2'>
        //             <label htmlFor="" className='text-sm font-bold py-2 block'>Address</label>
        //             <textarea name='address' className='w-full border-[1px] border-grey-200 p-2 rounded-sm' placeholder='Address' onChange={(e: any) => setAddress(e.target.value)} />
        //         </div>
        //         <div className='w-full py-2'>
        //             <label htmlFor="" className='text-sm font-bold py-2 block'>Phone</label>
        //             <input type='text' name='phone' className='w-full border-[1px] border-grey-200 p-2 rounded-sm' placeholder='Phone' onChange={(e: any) => setPhone(e.target.value)} />
        //         </div>
        //         <div className='w-full py-2'>
        //             <Button className="w-20 p-2 text-white border-gray-200 border-[1px] rounded-sm bg-green-400">Submit</Button>
        //         </div>
        //     </form>
        // </div>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <span className='font-bold py-2 block text-2xl text-center'>Add Data Person</span>
            <Card className="w-[550px]" onSubmit={addPerson}>
                <CardHeader>
                    <CardContent>
                        <form>
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg" >Name</Label>
                                    <Input id="name" placeholder="Name" className="text-lg p-5" onChange={(e: any) => setName(e.target.value)}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg">Address</Label>
                                    <Input id="address" placeholder="Address" className="text-lg p-5" onChange={(e: any) => setAddress(e.target.value)}/>
                                </div>

                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="name" className="text-lg">Phone</Label>
                                    <Input id="phone" placeholder="+62" className="text-lg p-5" onChange={(e: any) => setPhone(e.target.value)}/>
                                </div>

                                <div className='w-full flex justify-center py-2'>
                                    <Button className="w-80 p-5 text-white border-gray-200 border-[1px] rounded-sm bg-green-400 text-lg" variant="outline" size="sm">Submit</Button>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                </CardHeader>
            </Card>
        </div>
        
    );
}

