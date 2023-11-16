// producer/producer.module.ts
import {Module} from '@nestjs/common'
import {ProducerService} from './producer.service'
import {ProducerController} from './producer.controller'
import {CqrsModule} from '@nestjs/cqrs'
import {AddProducerHandler, ProducerCreatedEventHandler} from './handler'
import {ProducerRepository} from './repositories'

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
