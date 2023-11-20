import {Injectable} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {StorageUnitDto} from './dto'
import {AddStorageUnitCommand} from './commands'

@Injectable()
export class StorageUnitService {
  constructor(private readonly commandBus: CommandBus) {}

  async createStorageUnit(storageUnit: StorageUnitDto): Promise<void> {
    return await this.commandBus.execute(new AddStorageUnitCommand(storageUnit))
  }
}
