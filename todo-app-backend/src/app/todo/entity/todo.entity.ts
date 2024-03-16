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
  id: string;

  @Column()
  task: string;
  @Column({ name: 'is_done', type: 'tinyint', width: 1 })
  isDone: number;

  @CreateDateColumn({ name: 'created_At' })
  createdAt: string;
  @CreateDateColumn({ name: 'updated_At' })
  updatedAt: string;
  @DeleteDateColumn({ name: 'deleted_At' })
  deleteddAt: string;
}
