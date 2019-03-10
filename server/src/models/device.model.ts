import {
  Table,
  Column,
  Is,
  PrimaryKey,
  Model,
  ForeignKey,
  BelongsTo,
  AutoIncrement,
  AllowNull,
  Unique,
} from 'sequelize-typescript';

import Channel from './channel.model';
import { GoogleDeviceModel } from '../types';

@Table
class Device extends Model<Device> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @Unique
  @Column
  public identifier!: string;

  @Column
  public nickname!: string;

  @Column
  public address!: string;

  @Column
  public model!: GoogleDeviceModel;

  @Is(/0|90|180|270/)
  @Column
  public rotation!: number;

  @Column
  public status!: string;

  @AllowNull
  @ForeignKey(() => Channel)
  @Column
  public channelId!: number;

  @BelongsTo(() => Channel, {
    foreignKey: {
      allowNull: true,
    },
  })
  public channel!: Channel;
}

export default Device;
