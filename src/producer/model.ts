import {Type} from './enum'
import {AggregateRoot} from '@nestjs/cqrs'
import {ProducerDto} from './dto'
import {ProducerCreatedEvent} from './events'

export class Producer extends AggregateRoot {
  id: string
  type: Type
  capacity: number

  setData(data: ProducerDto) {
    this.id = data.id
    this.type = data.type
    this.capacity = data.capacity
  }

  getData(): ProducerDto {
    return {
      id: this.id,
      type: this.type,
      capacity: this.capacity,
    }
  }

  applyEvent() {
    this.apply(new ProducerCreatedEvent(this.getData()))
  }
}
