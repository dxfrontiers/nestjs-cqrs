import {
  AggregateRoot,
  CommandHandler,
  EventPublisher,
  EventsHandler,
  ICommandHandler,
  IEventHandler,
} from '@nestjs/cqrs'
import {StorageDisabledEvent, StorageEnabledEvent, StorageRegisteredEvent} from './storage.events'
import {DisableStorageUnitCommand, EnableStorageUnitCommand, RegisterStorageUnitCommand,} from './storage.commands'
import {StorageCapacityProjection} from '../capacity/storage-capacity.projection'
import {AppendResult, jsonEvent} from "@eventstore/db-client";
import {client as eventStore} from '../eventstore'

export class StorageAggregate extends AggregateRoot {
  private id: string;
  private capacity: number;
  disabled: boolean = false;

  constructor() {
    super();
  }

  registerStorage(aggregateId: string, capacity: number) {
    this.apply(new StorageRegisteredEvent(aggregateId, capacity));
  }

  enableStorage(): void {
    if(this.disabled) {
      this.apply(new StorageEnabledEvent(this.id, this.capacity))
    }
  }

  disableStorage() {
    if (!this.disabled) {
      this.apply(new StorageDisabledEvent(this.id, this.capacity));
    }
  }

  applyStorageRegisteredEventToAggregate(event: StorageRegisteredEvent): void {
    this.id = event.aggregateId;
    this.capacity = event.capacity;
    this.disabled = false;
  }

  applyStorageDisabledEventToAggregate() {
    this.disabled = true;
  }

  applyStorageEnabledEventToAggregate() {
    this.disabled = false;
  }

  static async loadAggregate(aggregateId: string): Promise<StorageAggregate> {
    const events = eventStore.readStream('storage-unit-stream-' + aggregateId);
    let count = 0;
    const aggregate = new StorageAggregate();

    for await (const event of events) {
      const data: any = event.event.data;
      try {
        switch (event.event.type) {
          case 'StorageUnitCreated':
            aggregate.applyStorageRegisteredEventToAggregate({
              aggregateId: data.id,
              capacity: parseInt(data.capacity),
            });
            break;
          case 'StorageUnitDisabled':
            aggregate.applyStorageDisabledEventToAggregate();
            break;
          case 'StorageUnitEnabled':
            aggregate.applyStorageDisabledEventToAggregate();
            break;
          default:
            break
        }
      } catch(e) {
        console.error("Could not process event")
      }
      count++;
    }
    console.log("Anzahl der Events:", count);
    console.log("aggregate nach dem Event Sourcing:", aggregate);

    return aggregate;

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
    console.log("command", command)
    /**
     * mergeObjectContext:
     * Merge the event publisher into the provided object.
     * This is required to make publish and publishAll available on the AgreggateRoot class instance.
     * Params:
     * object – The object to merge into.
     */
    const aggregate = this.publisher.mergeObjectContext(new StorageAggregate())
    aggregate.registerStorage(command.aggregateId, command.capacity)
    aggregate.commit()
  }
}

@CommandHandler(DisableStorageUnitCommand)
export class DisableStorageUnitHandler implements ICommandHandler<DisableStorageUnitCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: DisableStorageUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(
        await StorageAggregate.loadAggregate(command.aggregateId)
    );
    if (!aggregate.disabled) {
      console.log("Disabling storage unit");
      aggregate.disableStorage();
      aggregate.commit();
    }
  }
}

@CommandHandler(EnableStorageUnitCommand)
export class EnableStorageUnitHandler implements ICommandHandler<EnableStorageUnitCommand> {
  constructor(private readonly publisher: EventPublisher) {}

  async execute(command: EnableStorageUnitCommand): Promise<void> {
    const aggregate = this.publisher.mergeObjectContext(
        await StorageAggregate.loadAggregate(command.aggregateId)
    );
    if (aggregate.disabled) {
      console.log("Enabling storage unit");
      aggregate.enableStorage();
      aggregate.commit();
    }
  }
}


@EventsHandler(StorageRegisteredEvent)
export class StorageRegisteredEventHandler
  implements IEventHandler<StorageRegisteredEvent>
{
  constructor(private readonly capacityProjection: StorageCapacityProjection) {}

  async handle(event: StorageRegisteredEvent): Promise<void> {
    const eventData = jsonEvent({
      type: 'StorageUnitCreated',
      data: {
        id: event.aggregateId,
        capacity: event.capacity,
      },
    })

    const result: AppendResult = await eventStore.appendToStream(
        'storage-unit-stream-' + event.aggregateId,
        [eventData],
    )

    if (result.success) {
      this.capacityProjection.handleStorageRegistered(event)
    }

    console.log('result: ', result)
  }
}

@EventsHandler(StorageDisabledEvent)
export class StorageDisabledEventHandler implements IEventHandler<StorageDisabledEvent> {
  constructor(private readonly capacityProjection: StorageCapacityProjection) {}

  async handle(event: StorageDisabledEvent): Promise<void> {
    console.log("handling StorageDisabledEvent")
    console.log("disabling event:", event)
    const eventData = jsonEvent({
      type: 'StorageUnitDisabled',
      data: {
        id: event.aggregateId,
        disabledCapacity: event.capacity,
      },
    });
    const result: AppendResult = await eventStore.appendToStream(
        'storage-unit-stream-' + event.aggregateId,
        [eventData],
    );

    if (result.success) {
      this.capacityProjection.handleStorageDisabled(event);
    }
    console.log('StorageDisabledEvent result: ', result);
  }
}
