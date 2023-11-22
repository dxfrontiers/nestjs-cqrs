import {FORWARDS, START} from '@eventstore/db-client'
import {client as eventStore} from '../eventstore'
import {Injectable} from '@nestjs/common'
import {InjectRepository} from '@nestjs/typeorm'
import {Repository} from 'typeorm'
import {CapacityReadModel, StorageUnit} from './model'

@Injectable()
export class ReadModelService {
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
          if (data?.capacity != null) {
            createdEventsCapacities.push(Number(data.capacity))
          }
          break
        case 'StorageUnitDestroyed':
          if (data?.capacity != null) {
            createdEventsCapacities.push(Number(-data.capacity))
          }
          break
      }
    }

    return createdEventsCapacities.reduce((acc: number, curr: number) => {
      return Number(acc) + Number(curr)
    }, 0)
  }

  async sourceAllStorageUnitCreatedEvents(): Promise<StorageUnit[]> {
    const storageUnits: StorageUnit[] = []
    const events = eventStore.readAll({
      direction: FORWARDS,
      fromPosition: START,
    })

    for await (const {event} of events) {
      const data: any = event.data

      switch (event?.type) {
        case 'StorageUnitCreated':
          const storageUnit: StorageUnit = new StorageUnit()
          storageUnit.setData(data)
          storageUnits.push(storageUnit)
          break
      }
    }

    return storageUnits
  }

  async updateTotalCapacity(newTotalCapacity: number): Promise<void> {
    const capacityRecord: CapacityReadModel = new CapacityReadModel()
    capacityRecord.totalCapacity = newTotalCapacity

    await this.capacityRepository.save(capacityRecord)
  }
}

@Injectable()
export class StorageUnitCreatedReadModelService {}
