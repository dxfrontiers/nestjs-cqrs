import {ICommand} from '@nestjs/cqrs'

export class RegisterStorageUnitCommand implements ICommand {
  constructor(
    public readonly aggregateId: string,
    public readonly capacity: string,
  ) {}
}

export class DisableStorageUnitCommand implements ICommand {
  constructor(public readonly aggregateId: string) {}
}

export class EnableStorageUnitCommand implements ICommand {
  constructor(public readonly aggregateId: string) {}
}
