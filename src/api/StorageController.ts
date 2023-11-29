import {Controller, Get, Param, Post} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {
  DisableStorageUnitCommand,
  RegisterStorageUnitCommand,
} from '../storage/StorageCommands'
import {v4 as uuid} from 'uuid'

@Controller('storage')
export class StorageUnitController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/register')
  async registerStorage(@Param('capacity') capacity: number): Promise<any> {
    const aggregateId = uuid()
    await this.commandBus.execute(
      new RegisterStorageUnitCommand(aggregateId, capacity),
    )
  }

  @Post('/:id/disable')
  async disableStorage(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new DisableStorageUnitCommand(id))
  }

  @Get('/currentCapacity')
  getCapacity(): number {
    return
  }
}
