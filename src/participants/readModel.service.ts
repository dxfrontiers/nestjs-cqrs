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
      maxCount: 1,
    })

    for await (const {event} of events) {
      const data: any = event.data

      switch (event?.type) {
        case 'StorageUnitCreated':
          createdEventsCapacities.push(data.capacity)
          break
        case 'StorageUnitDestroyed':
          createdEventsCapacities.push(-data.capacity)
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
}
