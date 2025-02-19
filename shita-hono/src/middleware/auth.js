import { db } from "../drizzle/index.js";
import { eq } from "drizzle-orm";
import { Auth } from "../drizzle/schema.js";
export const apiKeyAuth = async (c, next) => {
    const apiKey = c.req.header('api-key');
    if (!apiKey) {
        return c.json({ statusCode: 401, message: 'Masukan API key terlebih dahulu' }, 401);
    }
    const data = await db.query.Auth.findFirst({
        where: eq(Auth.key, apiKey),
    });
    if (!data) {
        return c.json({ statusCode: 401, message: 'Api key salah' }, 401);
    }
    await next();
};
