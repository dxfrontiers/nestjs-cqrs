import {KillDragonDto} from './dto/kill-dragon.dto'

export class KillDragonCommand {
  constructor(
    public readonly heroId: string,
    public readonly dragonId: KillDragonDto,
  ) {}
}
