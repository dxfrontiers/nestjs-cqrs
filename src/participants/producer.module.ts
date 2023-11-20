import {Module} from '@nestjs/common'
import {ProducerService} from './producer.service'
import {ProducerController} from './producer.controller'
import {CqrsModule} from '@nestjs/cqrs'
import {AddProducerHandler} from './commandHandler'
import {ProducerRepository} from './repositories'
import {ProducerCreatedEventHandler} from './eventHandler'

@Module({
  imports: [CqrsModule],
  controllers: [ProducerController],
  providers: [
    ProducerService,
    ProducerRepository,
    AddProducerHandler,
    ProducerCreatedEventHandler,
  ],
  exports: [ProducerService],
})
export class ProducerModule {}
