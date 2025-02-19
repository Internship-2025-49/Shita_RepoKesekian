// import prisma from "../../prisma/client/index.js";
import { Person } from "../drizzle/schema.js";
import { eq } from "drizzle-orm";
import { db } from "../drizzle/index.js";
/**
 * Getting all posts
 */
export const getPerson = async (c) => {
    try {
        //get all posts
        // const person = await prisma.person.findMany({ orderBy: { id: 'asc' } });
        const data = await db.select().from(Person);
        //return JSON
        return c.json(data);
    }
    catch (e) {
        console.error(`Error getting posts: ${e}`);
    }
};
export async function createPerson(c) {
    try {
        //get body request
        const body = await c.req.json();
        //check if title and content is string
        const name = typeof body['name'] === 'string' ? body['name'] : '';
        const address = typeof body['address'] === 'string' ? body['address'] : '';
        const phone = typeof body['phone'] === 'string' ? body['phone'] : '';
        const person = await db.insert(Person).values({
            name: name,
            address: address,
            phone: phone
        });
        //return JSON
        return c.json(person);
    }
    catch (e) {
        console.error(`Error creating person: ${e}`);
    }
}
export async function getPersonById(c) {
    try {
        // Konversi tipe id menjadi number
        const personId = parseInt(c.req.param('id'));
        //get food by id
        const user = await db.select()
            .from(Person)
            .where(eq(Person.id, personId));
        //if food not found
        if (!Person) {
            //return JSON
            return c.json({
                statusCode: 404,
                message: 'ID Food Not Found!',
            });
        }
        //return JSON
        return c.json(user);
    }
    catch (e) {
        console.error(`Error finding food: ${e}`);
    }
}
export async function updatePerson(c) {
    try {
        // Konversi tipe id menjadi number
        const personId = parseInt(c.req.param('id'));
        //get body request
        const body = await c.req.json();
        //check if title and content is string
        const name = typeof body['name'] === 'string' ? body['name'] : '';
        const address = typeof body['address'] === 'string' ? body['address'] : '';
        const phone = typeof body['phone'] === 'string' ? body['phone'] : '';
        //update food with prisma
        await db.update(Person)
            .set({
            name: name,
            address: address,
            phone: phone,
        })
            .where(eq(Person.id, personId));
        const updatedPerson = await db.select()
            .from(Person)
            .where(eq(Person.id, personId));
        //return JSON
        return c.json(updatedPerson);
    }
    catch (e) {
        console.error(`Error updating food: ${e}`);
    }
}
export async function deletePerson(c) {
    try {
        // Konversi tipe id menjadi number
        const personId = parseInt(c.req.param('id'));
        //delete food with prisma
        await db.delete(Person)
            .where(eq(Person.id, personId));
        //return JSON
        return c.json({
            statusCode: 200,
            message: 'Person Deleted Successfully!',
        });
    }
    catch (e) {
        console.error(`Error deleting person: ${e}`);
    }
}
