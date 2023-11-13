import {EventStoreDBClient, FORWARDS, START} from '@eventstore/db-client'

// If the connectionString method returns an instance of EventStoreDBClient, the type is inferred
const client = EventStoreDBClient.connectionString(
  'esdb://localhost:2113?tls=false',
)

const connect = () => {
  try {
    // Await the asynchronous readAll method
    const result = client.readAll({
      direction: FORWARDS,
      fromPosition: START,
      maxCount: 1,
    })
    // Handle the result here if needed
  } catch (error) {
    // Error handling
    console.error('Error connecting to EventStoreDB:', error)
  }
}

export {client, connect}
