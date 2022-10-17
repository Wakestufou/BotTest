import { Model, Column, Table, AllowNull } from 'sequelize-typescript';

@Table
export class Roles extends Model {
    @AllowNull(false)
    @Column
    id_guild!: string;

    @Column
    id_role!: string;

    @Column
    name!: string;

    @Column
    description!: string;
}
