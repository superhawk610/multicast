import {
  Table,
  Column,
  PrimaryKey,
  Model,
  AutoIncrement,
} from 'sequelize-typescript';

@Table
class Alert extends Model<Alert> {
  @PrimaryKey
  @AutoIncrement
  @Column
  public id!: number;

  @Column
  public title!: string;

  @Column
  public body!: string;
}

export default Alert;
