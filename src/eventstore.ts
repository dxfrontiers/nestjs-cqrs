import {EventStoreDBClient, FORWARDS, START} from '@eventstore/db-client'

const client = EventStoreDBClient.connectionString(
  'esdb://localhost:2113?tls=false',
)

const connect = () => {
  try {
    const result = client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1,
    })
  } catch (error) {
    console.error('Error connecting to EventStoreDB:', error)
  }
}

export {client, connect}
