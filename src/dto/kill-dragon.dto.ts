enum Strategy {
  MELEE = 'MELEE',
  RANGED = 'RANGED',
  SPELL = 'SPELL',
}

export class KillDragonDto {
  dragonId: string
  strategy: Strategy
}
