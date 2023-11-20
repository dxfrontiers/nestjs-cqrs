import {Injectable} from '@nestjs/common'
import {Producer, StorageUnit} from './model'
import {ProducerDto, StorageUnitDto} from './dto'

@Injectable()
export class ProducerRepository {
  async createProducer(producerDto: ProducerDto) {
    const producer = new Producer()
    producer.setData(producerDto)
    producer.applyEvent()
    return producer
  }
}

export class StorageUnitRepository {
  async createStorageUnit(
    storageUnitDto: StorageUnitDto,
  ): Promise<StorageUnit> {
    const storageUnit: StorageUnit = new StorageUnit()
    storageUnit.setData(storageUnitDto)
    storageUnit.applyEvent()
    return storageUnit
  }
}
