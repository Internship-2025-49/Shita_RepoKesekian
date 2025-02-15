import type { Context } from "hono";
import prisma from "../../prisma/client/index.js";


/**
 * Getting all posts
 */
export const getPerson = async (c: Context) => {
    try {
        //get all posts
        const person = await prisma.person.findMany({ orderBy: { id: 'asc' } });

        //return JSON
        return c.json(person);

    } catch (e: unknown) {
        console.error(`Error getting posts: ${e}`);
    }
}

export async function createPerson(c: Context) {
  try {

    //get body request
    const body = await c.req.json();

    //check if title and content is string
    const name   = typeof body['name'] === 'string' ? body['name'] : '';
    const address = typeof body['address'] === 'string' ? body['address'] : '';
    const phone = typeof body['phone'] === 'string' ? body['phone'] : '';

  
    const person = await prisma.person.create({
      data: {
        name: name,
        address: address,
        phone: phone
      }
    });

    //return JSON
    return c.json({
      statusCode : 201,
      message: 'Person Created Successfully!',
      data: person
    });

  } catch (e: unknown) {
    console.error(`Error creating person: ${e}`);
  }
}

export async function getPersonById(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const personId = parseInt(c.req.param('id'));

      //get food by id
      const person = await prisma.person.findMany({
          where: { id: personId },
      });

      console.log('Data Of Food: ', person)

      //if food not found
      if (!person) {
          //return JSON
          return c.json({
              statusCode : 404,
              message: 'ID Food Not Found!',
          });
      }

       //return JSON
       return c.json(person);
  } catch (e: unknown) {
      console.error(`Error finding food: ${e}`);
  }
}

export async function updatePerson(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const personId = parseInt(c.req.param('id'));

      //get body request
      const body = await c.req.json();

      //check if title and content is string
      const name   = typeof body['name'] === 'string' ? body['name'] : '';
      const address = typeof body['address'] === 'string' ? body['address'] : '';
      const phone = typeof body['phone'] === 'string' ? body['phone'] : '';

      //update food with prisma
      const person = await prisma.person.update({
          where: { id: personId },
          data: {
            name,
            address,
            phone
          },
      });

      //return JSON
      return c.json({
          statusCode : 200,
          message: 'food Updated Successfully!',
          data: person
      });

  } catch (e: unknown) {
      console.error(`Error updating food: ${e}`);
  }
}

export async function deletePerson(c: Context) {
  try {

      // Konversi tipe id menjadi number
      const personId = parseInt(c.req.param('id'));

      //delete food with prisma
      await prisma.person.delete({
          where: { id: personId },
      });

      //return JSON
      return c.json({
          statusCode : 200,
          message: 'Person Deleted Successfully!',
      });

  } catch (e: unknown) {
      console.error(`Error deleting person: ${e}`);
  }
}