import {FORWARDS, START} from '@eventstore/db-client'
import {client as eventStore} from '../eventstore'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CapacityReadModel} from './model'

@Injectable()
export class CapacityReadModelService {
  constructor(
    @InjectRepository(CapacityReadModel)
    private readonly capacityRepository: Repository<CapacityReadModel>,
  ) {}

  async sourceAllStorageUnitCreatedCapacity(): Promise<number> {
    const createdEventsCapacities: number[] = []
    const events = eventStore.readAll({
      direction: FORWARDS,
      fromPosition: START,
    })

    for await (const {event} of events) {
      const data: any = event.data

      switch (event?.type) {
        case 'StorageUnitCreated':
          createdEventsCapacities.push(Number(data.capacity))
          break
        case 'StorageUnitDestroyed':
          createdEventsCapacities.push(Number(-data.capacity))
          break
      }
    }

    const totalCapacity: number = createdEventsCapacities.reduce(
      (acc: number, curr: number) => {
        return acc + curr
      },
      0,
    )

    console.log('totalCapacity: ', totalCapacity)
    return totalCapacity
  }

  async getLatestCapacityRecord(): Promise<CapacityReadModel | null> {
    const query = 'SELECT * FROM capacity_read_model ORDER BY id DESC LIMIT 1'
    const result = await this.capacityRepository.query(query)

    if (result.length > 0) {
      return result[0]
    }

    console.log('result: ', result)

    return null
  }

  async updateTotalCapacity(newTotalCapacity: number): Promise<void> {
    const capacityRecord: CapacityReadModel =
      await this.getLatestCapacityRecord()
    if (capacityRecord) {
      capacityRecord.totalCapacity = newTotalCapacity
    } else {
      const newCapacityRecord = new CapacityReadModel()
      newCapacityRecord.totalCapacity = newTotalCapacity
      await this.capacityRepository.save(newCapacityRecord)
    }
    await this.capacityRepository.save(capacityRecord)
  }
}
