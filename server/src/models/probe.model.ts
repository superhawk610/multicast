import {
  Table,
  Column,
  PrimaryKey,
  Model,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Device from './device.model';

@Table
class Probe extends Model<Probe> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @ForeignKey(() => Device)
  @Column
  public deviceId!: number;

  @BelongsTo(() => Device)
  public device!: Device;

  @Column
  public responseCode!: number;
}

export default Probe;
