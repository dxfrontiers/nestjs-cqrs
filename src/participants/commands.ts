import {ProducerDto, StorageUnitDto} from './dto'
import {ICommand} from '@nestjs/cqrs'

export class AddProducerCommand implements ICommand {
  constructor(public readonly producerDto: ProducerDto) {}
}

export class AddStorageUnitCommand implements ICommand {
  constructor(public readonly storageUnitDto: StorageUnitDto) {}
}
