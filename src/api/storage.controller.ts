import {Controller, Get, Param, Post, Query} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {
  DisableStorageUnitCommand,
  EnableStorageUnitCommand,
  RegisterStorageUnitCommand
} from '../storage/storage.commands'
import {v4 as uuid} from 'uuid'

/**
 * Receives requests via REST and executes commands on the commandBus
 * Uses the commands from the storage.commands
 *
 */
@Controller('storage')
export class StorageUnitController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/register')
  async registerStorage(@Query('capacity') capacity: string): Promise<any> {
    const aggregateId = uuid()
    await this.commandBus.execute(new RegisterStorageUnitCommand(aggregateId, capacity))
    return { message: 'command received', aggregateId };
  }

  @Post('/:id/disable')
  async disableStorage(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new DisableStorageUnitCommand(id))
    return { message: 'Command Received' };
  }

  @Post('/:id/enable')
  async enableStorage(@Param('id') id: string): Promise<any> {
    await this.commandBus.execute(new EnableStorageUnitCommand(id))
    return { message: 'Command received' };
  }

  @Get('/currentCapacity')
  getCapacity(): number {
    return
  }
}
