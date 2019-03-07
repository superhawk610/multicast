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

  @Is(/0|90|180|270/)
  @Column
  public rotation!: number;

  @Column
  public online!: boolean;

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
