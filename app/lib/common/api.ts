import 'dotenv/config'
import { execSync } from 'node:child_process'
import { APIResponse, request } from '@playwright/test'

interface JSONLDResponseMember {
  readonly '@id': string | number
  readonly '@type': string
}
interface JSONLDResponse<T> {
  readonly '@context': string
  readonly '@id': string
  readonly '@type': string
  readonly 'hydra:totalItems': number
  'hydra:member': ReadonlyArray<T & JSONLDResponseMember>
}

const tokens: Map<string, string> = new Map()
export const apiUrl = process.env.API_URL || 'http://localhost:8000'
export function loadFixtures() {
  console.info('Loading fixtures...')
  execSync(
      `docker  exec ${process.env.API_CONTAINER_ID} bin/console hautelook:fixtures:load --quiet >> /dev/null`,
  )
}

export async function getAuthToken(
  credentials = { email: 'user_base@example.com', password: '0000' },
) {
  if (!tokens.has(credentials.email)) {
    const context = await request.newContext({
      baseURL: apiUrl,
    })
    const response = await context.post(`${apiUrl}/login`, {
      data: credentials,
    })

    if (!response.ok) {
      throw Error('Token retrieve failed')
    }
    const json = await response.json()
    tokens.set(credentials.email, json.token)
  }
  return 'Bearer ' + tokens.get(credentials.email)
}

export async function getJsonLDResponse(response: APIResponse) {
  return (await response.json()) as JSONLDResponse<object>
}

export async function getJsonLDResponseTotalMembers(
  response: APIResponse,
): Promise<number> {
  return (await getJsonLDResponse(response))['hydra:totalItems']
}
