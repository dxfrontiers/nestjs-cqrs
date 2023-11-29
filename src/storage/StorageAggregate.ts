import {
  AggregateRoot,
  CommandHandler,
  EventPublisher,
  EventsHandler,
  ICommandHandler,
  IEventHandler,
} from '@nestjs/cqrs'
import {StorageDisabledEvent, StorageRegisteredEvent} from './StorageEvents'
import {
  DisableStorageUnitCommand,
  RegisterStorageUnitCommand,
} from './StorageCommands'
import {StorageCapacityProjection} from '../capacity/storage-capacity.projection'

export class StorageAggregate extends AggregateRoot {
  private id: string
  private capacity: number
  private disabled: boolean = false

  constructor() {
    super()
  }

  registerStorage(aggregateId: string, capacity: number) {
    this.apply(new StorageRegisteredEvent(aggregateId, capacity))
  }

  disableStorage(aggregateId: string) {
    if (!this.disabled && this.id === aggregateId) {
      this.apply(new StorageDisabledEvent(this.id, this.capacity))
    }
  }

  // Event Handler
  onStorageRegistered(event: StorageRegisteredEvent) {
    this.id = event.aggregateId
    this.capacity = event.capacity
  }

  onStorageDisabled(event: StorageDisabledEvent) {
    this.disabled = true
  }
}

// TODO: CommandHandler does NOT persist. CommandHandler usually triggers other
// business logic and, above all, checks if the command is valid and can be applied

// Example: Check if producer is valid and if it's allowed to join or not
// If all good, commandHandler writes event to eventBus
// other parts listen to eventBus

// Example: Are we able to add more producers? Yes: Write producerAddedEvent to EventBus

// Question: What happens if EventHandler fails? How to handle this? NestJS feature?

// Question: When is the best moment/step to write an Event to the ES?

@CommandHandler(RegisterStorageUnitCommand)
export class RegisterStorageUnitHandler
  implements ICommandHandler<RegisterStorageUnitCommand>
{
  constructor(private readonly publisher: EventPublisher) {} // TODO: Check what the EventPublisher does and whats the difference to EventBus

  // TODO: Check how publisher works and what can be published
  async execute(command: RegisterStorageUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(new StorageAggregate())

    aggregate.registerStorage(command.aggregateId, command.capacity)
    aggregate.commit()
  }
}

@CommandHandler(DisableStorageUnitCommand)
export class DisableStorageUnitHandler
  implements ICommandHandler<DisableStorageUnitCommand>
{
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: DisableStorageUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(new StorageAggregate())

    aggregate.disableStorage(command.aggregateId)
    aggregate.commit()
  }
}

@EventsHandler(StorageRegisteredEvent)
export class StorageRegisteredEventHandler
  implements IEventHandler<StorageRegisteredEvent>
{
  constructor(private readonly capacityProjection: StorageCapacityProjection) {}

  async handle(event: StorageRegisteredEvent): Promise<void> {
    this.capacityProjection.handleStorageRegistered(event)
  }
}

@EventsHandler(StorageDisabledEvent)
export class StorageDisabledEventHandler
  implements IEventHandler<StorageDisabledEvent>
{
  constructor(private readonly capacityProjection: StorageCapacityProjection) {}

  async handle(event: StorageDisabledEvent): Promise<void> {
    this.capacityProjection.handleStorageDisabled(event)
  }
}
