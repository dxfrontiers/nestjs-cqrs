import {Type} from './enum'
import {AggregateRoot} from '@nestjs/cqrs'
import {ProducerDto, StorageUnitDto} from './dto'
import {ProducerCreatedEvent, StorageUnitCreatedEvent} from './events'
import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm'

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
    const dto = new ProducerDto()
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

export class StorageUnit extends AggregateRoot {
  id: string
  capacity: number

  setData(data: StorageUnitDto): void {
    this.id = data.id
    this.capacity = data.capacity
  }

  getData(): StorageUnitDto {
    return {
      id: this.id,
      capacity: this.capacity,
    }
  }

  applyEvent(): void {
    this.apply(new StorageUnitCreatedEvent(this.getData()))
  }
}

@Entity()
export class CapacityReadModel {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  totalCapacity: number
}
