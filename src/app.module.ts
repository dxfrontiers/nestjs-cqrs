import {Module} from '@nestjs/common'
import {AppController} from './app.controller'
import {AppService} from './app.service'
import {ProducerModule} from './participants/producer.module'
import {StorageUnitModule} from './participants/storageUnit.module'

@Module({
  imports: [ProducerModule, StorageUnitModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
