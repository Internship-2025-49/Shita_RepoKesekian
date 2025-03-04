import { Hono } from 'hono';
import { createPerson, deletePerson, getPerson, getPersonById, updatePerson } from '../controllers/PersonController';
import { jwt } from 'hono/jwt'
import type { JwtVariables } from 'hono/jwt'
import { apiKeyAuth } from '../middleware/auth';
import { bearerAuth } from 'hono/bearer-auth';
import { loginUser } from '../controllers/AuthController';
import { db } from '../drizzle/index.js'

import dotenv from 'dotenv'
import prisma from '../../prisma/client/index';
dotenv.config();

import { zValidator } from '@hono/zod-validator'
import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { personSchema } from '../schemas/personSchema';

const SECRET_KEY: any = process.env.KEY;

// type Variables = JwtVariables

// const app = new Hono<{ Variables: Variables }>()
const app = new Hono()
// app.use('*', apiKeyAuth)

app.post('/login', loginUser);

app.use('/data/*', jwt({ secret: SECRET_KEY }));

app.get('/shita', async (c) => {
    // const auth = await db.query.Auth.findFirst()
    const auth = await prisma.auth.findFirst()
  if (auth) {
      return c.json(
          { 
              statusCode: 200, 
              message: 'Authorized',
              key: auth.key 
          }
      )
  }
})



app.get('/data', (c) => getPerson(c));
app.post('/data',
    zValidator('json', personSchema),
    (c) => createPerson(c)
);
app.get('/data/:id', (c) => getPersonById(c));
app.put('/data/:id',
    zValidator('json', personSchema),
    (c) => updatePerson(c)
);
app.delete('/data/:id', (c) => deletePerson(c));


export const Routes = app;