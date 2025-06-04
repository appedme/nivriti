import { drizzle } from 'drizzle-orm/d1';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import * as schema from './schema';

export function getDB() {
    const context = getCloudflareContext();
    if (!context?.env?.DB) {
        throw new Error('D1 database binding not found');
    }
    return drizzle(context.env.DB, { schema });
}

export { schema };
