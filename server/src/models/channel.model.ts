import {
  Table,
  PrimaryKey,
  Column,
  Model,
  HasMany,
  AutoIncrement,
  DataType,
} from 'sequelize-typescript';

import Device from './device.model';

@Table
class Channel extends Model<Channel> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @Column
  public name!: string;

  @Column
  public layout!: string;

  @Column
  public duration!: number;

  @Column(DataType.STRING)
  public get urls(): string[][] {
    // TODO: remove type coercion once
    // https://github.com/sequelize/sequelize/issues/11558 is resolved
    return JSON.parse((this.getDataValue('urls') as unknown) as string);
  }

  public set urls(value: string[][]) {
    // TODO: remove once above issue is resolved
    // @ts-ignore
    this.setDataValue('urls', JSON.stringify(value));
  }

  @HasMany(() => Device)
  public devices!: Device[];
}

export default Channel;
