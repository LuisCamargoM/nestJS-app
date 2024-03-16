import { IsIn, IsNotEmpty, IsNumber, isIn } from 'class-validator';

export class CreateTodoDto {
  @IsNotEmpty()
  task: string;

  @IsNotEmpty()
  @IsNumber()
  @IsIn([0, 1])
  isDone: number;
}
