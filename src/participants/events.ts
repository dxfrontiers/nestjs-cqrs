import {IEvent} from '@nestjs/cqrs'
import {ProducerDto, StorageUnitDto} from './dto'

export class ProducerCreatedEvent implements IEvent {
  constructor(public readonly data: ProducerDto) {}
}

export class StorageUnitCreatedEvent implements IEvent {
  constructor(public readonly data: StorageUnitDto) {}
}
