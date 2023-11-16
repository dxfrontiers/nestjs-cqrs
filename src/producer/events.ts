import {IEvent} from '@nestjs/cqrs'
import {ProducerDto} from './dto'

export class ProducerCreatedEvent implements IEvent {
  constructor(public readonly data: ProducerDto) {}
}
