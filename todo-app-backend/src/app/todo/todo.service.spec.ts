import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getCustomRepositoryToken, getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './entity/todo.entity';
import { Entity, Repository } from 'typeorm';
import { NotAcceptableException, NotFoundException } from '@nestjs/common';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('Todo Service', () => {
  let todoService: TodoService;
  let todoRepository: Repository<TodoEntity>;
  let todoEntityList: TodoEntity[] = [
    new TodoEntity({
      id: '1',
      task: 'task-1',
      isDone: 0,
    }),
    new TodoEntity({
      id: '2',
      task: 'task-2',
      isDone: 0,
    }),
    new TodoEntity({
      id: '3',
      task: 'task-3',
      isDone: 0,
    }),
  ];
  let newTodoEntity = new TodoEntity({
    task: 'task-1',
    isDone: 1,
  });
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        {
          provide: getRepositoryToken(TodoEntity),
          useValue: {
            find: jest.fn().mockResolvedValue(todoEntityList),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            create: jest.fn().mockReturnValue(todoEntityList[0]),
            save: jest.fn().mockResolvedValue(todoEntityList[0]),

            merge: jest.fn().mockReturnValue(newTodoEntity),
            softDelete: jest.fn().mockReturnValue(undefined),
          },
        },
      ],
    }).compile();

    todoService = module.get<TodoService>(TodoService);
    todoRepository = module.get<Repository<TodoEntity>>(
      getRepositoryToken(TodoEntity),
    );
  });

  it('should be defined', () => {
    expect(todoService).toBeDefined();
  });

  describe('findAll', () => {
    it('It shoud return a list of TodoEntities successfully', async () => {
      const result = await todoService.findAll();

      expect(result).toEqual(todoEntityList);
      expect(todoRepository.find).toHaveBeenCalledTimes(1);
    });

    it('Should throw an Exception', () => {
      jest.spyOn(todoRepository, 'find').mockRejectedValueOnce(new Error());

      expect(todoService.findAll).rejects.toThrow();
    });
  });

  describe('findOneOrFail', () => {
    it('It shoud return an Entity successfully', async () => {
      const _id = '1';
      const result = await todoService.findOneOrFail(_id);

      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1);
    });

    it('Should throw an Not Found Exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      expect(todoService.findOneOrFail('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('It shoud create a TodoEntitiy successfully', async () => {
      let newTodo = {
        task: 'new-task',
        isDone: 0,
      };
      const result = await todoService.create(newTodo);

      expect(result).toEqual(todoEntityList[0]);
      expect(todoRepository.save).toHaveBeenCalledTimes(1);
      expect(todoRepository.create).toHaveBeenCalledTimes(1);
    });
    it('Should throw an Not Acceptable Exception', () => {
      let newTodo = {
        task: 'new-task',
        isDone: 0,
      };
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());

      expect(todoService.create(newTodo)).rejects.toThrow(
        NotAcceptableException,
      );
    });
  });

  describe('update', () => {
    it('It shoud update an Todo Entity successfully', async () => {
      const _id = '1';
      const _data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };

      jest.spyOn(todoRepository, 'save').mockResolvedValueOnce(newTodoEntity);
      const result = await todoService.update(_id, _data);
      expect(result).toEqual(newTodoEntity);
    });

    it('It shoud return a NotFound Exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      const _id = '1';
      const _data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };
      expect(todoService.update(_id, _data)).rejects.toThrow(NotFoundException);
    });

    it('It shoud return an Exception', () => {
      jest.spyOn(todoRepository, 'save').mockRejectedValueOnce(new Error());
      const _id = '1';
      const _data: UpdateTodoDto = {
        task: 'task-1',
        isDone: 1,
      };
      expect(todoService.update(_id, _data)).rejects.toThrow();
    });
  });

  describe('deleteById', () => {
    it('It shoud delete an Todo Entity successfully', async () => {
      const _id = '1';

      const result = await todoService.deleteById(_id);
      expect(result).toBeUndefined();
      expect(todoRepository.findOneOrFail).toHaveBeenCalledTimes(1)
      expect(todoRepository.softDelete).toHaveBeenCalledTimes(1)
    });

    it('It should throw a Not Found Exception', () => {
      jest
        .spyOn(todoRepository, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());

      const _id = '1';

      expect(todoService.deleteById(_id)).rejects.toThrow(NotFoundException);
    });

    it('It should throw an Exception', () => {
      jest
        .spyOn(todoRepository, 'softDelete')
        .mockRejectedValueOnce(new Error());

      const _id = '1';

      expect(todoService.deleteById(_id)).rejects.toThrow();
    });
  });
});
