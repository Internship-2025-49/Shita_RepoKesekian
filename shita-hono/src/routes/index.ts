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
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { personSchema } from '../schemas/personSchema';

// const SECRET_KEY: any = process.env.KEY;

const app = new OpenAPIHono()

app.post('/login', loginUser);

// app.use('/data/*', jwt({ secret: SECRET_KEY }));

app.get('/shita', async (c) => {
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

app.openapi(
  createRoute({
    method: 'get',
    path: '/hello',
    responses: {
      200: {
        description: 'Respond a message',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        }
      }
    }
  }),
  (c) => {
    return c.json({
      message: 'hello'
    })
  }
)

const getAllPersonsRoute = createRoute({
method: 'get',
path: '/api/person/data',
responses: {
    200: {
        description: 'Get all data persons',
        content: {
            'application/json': {
                schema: z.array(personSchema),
            },
        },
    },
    500: {
        description: 'Internal Server Error',
        content: {
            'application/json': {
                schema: z.object({ error: z.string() }),
            },
        },
    },
},
});

app.openapi(getAllPersonsRoute, getPerson);

const getDataByID = createRoute({
  method: 'get',
  path: '/api/person/data/{id}',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: {type: 'integer'}
    },
  ],
  responses: {
    200: {
      description: 'Get data person by ID',
      content: {
        'application/json': {
          schema: z.object(personSchema.shape),
        },
      },
    },
    500: {
      description: 'Internal Server Error',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

app.openapi(getDataByID, getPersonById); 

const createPersonRoute = createRoute({
  method: 'post',
  path: '/api/person/data',
  request: {
    body: {
      content: {
        'application/json': {
          schema: personSchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    201: {
      description: 'Person created successfully',
      content: {
        'application/json': {
          schema: personSchema,
        },
      },
    },
    500: {
      description: 'Internal server error',
      content: {
        'application/json': {
          schema: z.object({ error: z.string() }),
        },
      },
    },
  },
});

app.openapi(createPersonRoute, createPerson);

const updatePersonRoute = createRoute({
  method: 'put',
  path: '/api/person/data/{id}',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: z.number(),
    },
  ],
  request: {
    body: {
      content: {
        'application/json': {
          schema: personSchema.omit({ id: true }),
        },
      },
    },
  },
  responses: {
    200: {
      description: 'Person updated successfully',
      content: {
        'application/json': {
          schema: personSchema,
        },
      },
    },
  },
  500: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: z.object({ error: z.string() }),
      },
    },
  },
});

app.openapi(updatePersonRoute, updatePerson);

const deletePersonRoute = createRoute({
  method: 'delete',
  path: '/api/person/data/{id}',
  parameters: [
    {
      name: 'id',
      in: 'path',
      required: true,
      schema: z.string(),
    },
  ],
  responses: {
    200: {
      description: 'Person deleted successfully',
      content: {
        'application/json': {
          schema: z.object({message: z.string() }),
        },
      },
    },
  },
  500: {
    description: 'Internal server error',
    content: {
      'application/json': {
        schema: z.object({ error: z.string() }),
      },
    },
  },
});

app.openapi(deletePersonRoute, deletePerson);

app.doc('/doc', {
    openapi: '3.0.0',
    info: {
        title: 'User API',
        version: '1.0.0',
        description: 'API untuk mengelola data pengguna',
    },
})

app.get('/ui', swaggerUI({ url: '/api/person/doc' }));


export const Routes = app;