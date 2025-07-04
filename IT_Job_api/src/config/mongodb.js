import { env } from './environment'

import { MongoClient, ServerApiVersion } from 'mongodb'

let It_JobDatabaseInstance = null
const client = new MongoClient(env.MONGODB_URI, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
})

export const CONNECT_DB = async () => {
    await client.connect()
    It_JobDatabaseInstance = client.db(env.DATABASE_NAME)
}

export const GET_DB = () => {
    if (!It_JobDatabaseInstance) {
        throw new Error('You must call the connect function before calling the get function')
    }
    return It_JobDatabaseInstance
}

export const DISCONNECT_DB = async () => {
    await client.close()
}