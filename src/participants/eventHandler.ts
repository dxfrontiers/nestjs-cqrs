// EventHandler persists the event to the event store
import {EventsHandler, IEventHandler} from '@nestjs/cqrs'
import {ProducerCreatedEvent, StorageUnitCreatedEvent} from './events'
import {AppendResult, jsonEvent} from '@eventstore/db-client'
import {client as eventStore} from '../eventstore'
import {v4 as uuid} from 'uuid'
import {CapacityReadModelService} from './readModel.service'

@EventsHandler(ProducerCreatedEvent)
export class ProducerCreatedEventHandler
  implements IEventHandler<ProducerCreatedEvent>
{
  async handle(event: ProducerCreatedEvent): Promise<void> {
    const eventData = jsonEvent({
      type: 'ProducerCreated',
      data: {
        id: event.data.id,
        type: event.data.type,
        capacity: event.data.capacity,
      },
    })

    await eventStore.appendToStream('producer-stream-' + uuid(), [eventData])
  }
}

@EventsHandler(StorageUnitCreatedEvent)
export class StorageUnitCreatedEventHandler
  implements IEventHandler<StorageUnitCreatedEvent>
{
  constructor(private readonly capacityService: CapacityReadModelService) {}
  async handle(event: StorageUnitCreatedEvent): Promise<void> {
    const eventData = jsonEvent({
      type: 'StorageUnitCreated',
      data: {
        id: event.data.id,
        capacity: event.data.capacity,
      },
    })

    const result: AppendResult = await eventStore.appendToStream(
      'storage-unit-stream-' + uuid(),
      [eventData],
    )

    if (result.success) {
      console.log('event.data.capacity: ', event.data.capacity)
      const updatedCapacity: number =
        (await this.capacityService.sourceAllStorageUnitCreatedCapacity()) +
        Number(event.data.capacity)
      await this.capacityService.updateTotalCapacity(updatedCapacity)
    }

    console.log('result: ', result)
  }
}
