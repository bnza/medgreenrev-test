import 'dotenv/config'
import { spawnSync } from 'node:child_process';
import { request } from "@playwright/test";

const tokens: Map<string, string> = new Map()
export const apiUrl = process.env.API_URL || 'http://localhost:8000'
export function loadFixtures() {
    console.info('Loading fixtures...')
    spawnSync(
        'sh',
        ['-c', `cd ${process.env.API_PATH}; docker-compose exec php -T bin/console hautelook:fixtures:load --quiet`]
    )
}

export async function getAuthToken (credentials = {email: 'user_base@example.com', password: '0000'}) {

    if (!tokens.has(credentials.email)) {
        const context = await request.newContext({
            baseURL: apiUrl,
        });
        const response = await context.post(`${apiUrl}/login`, {
           data: credentials
        });

        if (!response.ok) {
            throw Error('Token retrieve failed')
        }
        const json = await response.json()
        tokens.set(credentials.email, json.token)
    }
    return 'Bearer ' + tokens.get(credentials.email)
}