import {ICommand} from '@nestjs/cqrs'

export class RegisterStorageUnitCommand implements ICommand {
  constructor(
    public readonly aggregateId: string,
    public readonly capacity: number,
  ) {}
}

export class DisableStorageUnitCommand implements ICommand {
  constructor(public readonly aggregateId: string) {}
}
