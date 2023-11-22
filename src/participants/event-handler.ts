// EventHandler persists the event to the event store
import {EventsHandler, IEventHandler} from '@nestjs/cqrs'
import {
  ProducerCreatedEvent,
  StorageUnitCreatedEvent,
  StorageUnitOnlineEvent,
} from './events'
import {AppendResult, jsonEvent} from '@eventstore/db-client'
import {client as eventStore} from '../eventstore'
import {v4 as uuid} from 'uuid'
import {ReadModelService} from './read-model.service'

@EventsHandler(ProducerCreatedEvent)
export class ProducerCreatedEventHandler
  implements IEventHandler<ProducerCreatedEvent>
{
  async handle(event: ProducerCreatedEvent): Promise<void> {
    const id = uuid()
    const eventData = jsonEvent({
      type: 'ProducerCreated',
      data: {
        id: id,
        type: event.data.type,
        capacity: event.data.capacity,
      },
    })

    await eventStore.appendToStream('producer-stream-' + id, [eventData])
  }
}

@EventsHandler(StorageUnitCreatedEvent)
export class StorageUnitCreatedEventHandler
  implements IEventHandler<StorageUnitCreatedEvent>
{
  constructor(private readonly capacityService: ReadModelService) {}
  async handle(event: StorageUnitCreatedEvent): Promise<void> {
    const id = uuid()
    const eventData = jsonEvent({
      type: 'StorageUnitCreated',
      data: {
        id: id,
        capacity: event.data.capacity,
      },
    })

    const result: AppendResult = await eventStore.appendToStream(
      'storage-unit-stream-' + id,
      [eventData],
    )

    if (result.success) {
      const updatedCapacity: number =
        (await this.capacityService.sourceAllStorageUnitCreatedCapacity()) +
        Number(event.data.capacity)
      await this.capacityService.updateTotalCapacity(updatedCapacity)
    }
  }
}

@EventsHandler(StorageUnitOnlineEvent)
export class StorageUnitOnlineEventHandler
  implements IEventHandler<StorageUnitOnlineEvent>
{
  constructor(private readonly capacityService: ReadModelService) {}
  async handle(event: StorageUnitOnlineEvent): Promise<void> {
    const eventData = jsonEvent({
      type: 'StorageUnitOnlineEvent',
      data: {
        id: event.data.id,
      },
    })

    const result: AppendResult = await eventStore.appendToStream(
      'storage-unit-stream-' + uuid(),
      [eventData],
    )

    if (result.success) {
      const updatedCapacity: number =
        (await this.capacityService.sourceAllStorageUnitCreatedCapacity()) -
        Number(event.data.capacity)
      await this.capacityService.updateTotalCapacity(updatedCapacity)
    }
  }
}
