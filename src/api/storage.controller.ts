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
  async registerStorage(@Query('capacity') capacity: number): Promise<any> {
    const aggregateId = uuid()
    await this.commandBus.execute(
      new RegisterStorageUnitCommand(aggregateId, capacity),
    )
    return { message: 'Storage unit registered successfully', aggregateId };
  }

  @Post('/:id/disable')
  async disableStorage(@Param('id') id: string): Promise<any> {
    // TODO: Schauen, wann und wie der Command nicht ausgeführt werden kann
    // wenn schon disabled und entsprechende Response an Client
    await this.commandBus.execute(new DisableStorageUnitCommand(id))
    console.log("id:", id)
    return { message: 'Storage unit disabled successfully' };
  }

  @Post('/:id/enable')
  async enableStorage(@Param('id') id: string): Promise<any> {
    // TODO: Schauen, wann und wie der Command nicht ausgeführt werden kann
    // wenn schon enabled und entsprechende Response an Client
    await this.commandBus.execute(new EnableStorageUnitCommand(id))
    console.log("id:", id)
    return { message: 'Storage unit enabled successfully' };
  }

  @Get('/currentCapacity')
  getCapacity(): number {
    return
  }
}
