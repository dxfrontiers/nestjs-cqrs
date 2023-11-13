import {CommandHandler, ICommandHandler} from '@nestjs/cqrs'
import {KillDragonCommand} from './kill-dragon.command'

@CommandHandler(KillDragonCommand)
export class KillDragonHandler implements ICommandHandler<KillDragonCommand> {
  constructor(private repository: HeroRepository) {}

  async execute(command: KillDragonCommand) {
    const {heroId, dragonId} = command
    const hero = this.repository.findOneById(+heroId)

    hero.killEnemy(dragonId)
    await this.repository.persist(hero)
  }
}
