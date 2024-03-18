import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return await this.todoRepository.find();
  }
  async findOneOrFail(id: string) {
    try {
      return await this.todoRepository.findOneOrFail({ where: { id: id } });
    } catch (error) {
      throw new NotFoundException(error.message);
    }
  }
  async create(data: CreateTodoDto) {
    try {
      return await this.todoRepository.save(this.todoRepository.create(data));
    } catch (error) {
      throw new NotAcceptableException(error.message);
    }
  }
  async update(id: string, data: UpdateTodoDto) {
    const newItem = await this.findOneOrFail(id);
    this.todoRepository.merge(newItem, data);
    return await this.todoRepository.save(newItem);
  }
  async deleteById(id: string) {
    await this.findOneOrFail(id);
    await this.todoRepository.softDelete(id);
  }
}
