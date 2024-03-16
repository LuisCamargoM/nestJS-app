import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'todos' })
export class TodoEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty()
  id: string;

  @Column()
  @ApiProperty()
  task: string;

  @Column({ name: 'is_done', type: 'tinyint', width: 1 })
  @ApiProperty()
  isDone: number;

  @CreateDateColumn({ name: 'created_At' })
  @ApiProperty()
  createdAt: string;
  @CreateDateColumn({ name: 'updated_At' })
  @ApiProperty()
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_At' })
  @ApiProperty()
  deleteddAt: string;
}
