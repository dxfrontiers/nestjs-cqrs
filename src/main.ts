import {NestFactory} from '@nestjs/core'
import {AppModule} from './app.module'
import {connect as connectToEventStore} from './eventstore'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  connectToEventStore()
  await app.listen(3333)
}
bootstrap().then(() => console.log('Application is listening on port 3333'))
