import {CommandHandler, EventPublisher, ICommandHandler} from '@nestjs/cqrs'
import {AddProducerCommand, AddStorageUnitCommand} from './commands'
import {ProducerRepository, StorageUnitRepository} from './repositories'

// TODO: CommandHandler does NOT persist. CommandHandler usually triggers other
// business logic and, above all, checks if the command is valid and can be applied

// Example: Check if producer is valid and if it's allowed to join or not
// If all good, commandHandler writes event to eventBus
// other parts listen to eventBus

// Example: Are we able to add more producers? Yes: Write producerAddedEvent to EventBus

// Question: What happens if EventHandler fails? How to handle this? NestJS feature?

// Question: When is the best moment/step to write an Event to the ES?

@CommandHandler(AddProducerCommand)
export class AddProducerHandler implements ICommandHandler<AddProducerCommand> {
  constructor(
    private readonly producerRepository: ProducerRepository,
    private readonly publisher: EventPublisher, // TODO: Check what the EventPublisher does and whats the difference to EventBus
  ) {}

  async execute(command: AddProducerCommand): Promise<void> {
    const producer = this.publisher.mergeObjectContext(
      // TODO: Check how publisher works and what can be published
      await this.producerRepository.createProducer(command.producerDto),
    )

    producer.commit()
  }
}

@CommandHandler(AddStorageUnitCommand)
export class AddStorageUnitHandler
  implements ICommandHandler<AddStorageUnitCommand>
{
  constructor(
    private readonly storageUnitRepository: StorageUnitRepository,
    private readonly publisher: EventPublisher, // TODO: Check what the EventPublisher does and whats the difference to EventBus
  ) {}

  async execute(command: AddStorageUnitCommand): Promise<void> {
    const storageUnit = this.publisher.mergeObjectContext(
      // TODO: Check how publisher works and what can be published
      await this.storageUnitRepository.createStorageUnit(
        command.storageUnitDto,
      ),
    )

    storageUnit.commit()
  }
}
