import {Injectable} from '@nestjs/common'
import {CommandBus} from '@nestjs/cqrs'
import {KillDragonCommand} from './kill-dragon.command'
import {KillDragonDto} from './dto/kill-dragon.dto'

@Injectable()
export class HeroesGameService {
  constructor(private commandBus: CommandBus) {}

  async killDragon(heroId: string, killDragonDto: KillDragonDto) {
    return this.commandBus.execute(new KillDragonCommand(heroId, killDragonDto))
  }
}
