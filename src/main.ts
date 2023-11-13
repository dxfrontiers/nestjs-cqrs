import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {connect as connectToEventStore} from './eventstore'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    connectToEventStore()
    await app.listen(3000)
  } catch (error) {
    console.error('Failed to start the application:', error)
    process.exit(1)
  }
}

bootstrap().then(() => console.log('NestJS app started listening on port 3000'))
