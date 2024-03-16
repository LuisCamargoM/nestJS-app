import { Test, TestingModule } from '@nestjs/testing';
import { TodoController } from './todo.controller';
import { TodoService } from './todo.service';
import { TodoEntity } from './entity/todo.entity';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

describe('TodoController', () => {
  let todoController: TodoController;
  let todoService: TodoService;
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
  const newTodoEntity = new TodoEntity({ task: 'new-task2', isDone: 0 });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TodoController],
      providers: [
        {
          provide: TodoService,
          useValue: {
            findAll: jest.fn().mockResolvedValue(todoEntityList),
            create: jest.fn().mockResolvedValue(newTodoEntity),
            findOneOrFail: jest.fn().mockResolvedValue(todoEntityList[0]),
            update: jest.fn().mockResolvedValue(newTodoEntity),
            deleteById: jest.fn().mockResolvedValue(undefined),
          },
        },
      ],
    }).compile();

    todoController = module.get<TodoController>(TodoController);
    todoService = module.get<TodoService>(TodoService);
  });

  it('should be defined', () => {
    expect(todoController).toBeDefined();
    expect(todoService).toBeDefined();
  });

  describe('Index', () => {
    it('should return a todo entity list successfully ', async () => {
      // Arrange : preparar variaveis, arranjar dados
      // Act: rodar os tests
      const result = await todoController.index();
      // Assert : garantir os expects
      expect(result).toEqual(todoEntityList);
    });

    it('throw an Exception ', async () => {
      jest.spyOn(todoService, 'findAll').mockRejectedValueOnce(new Error());
      expect(todoController.index()).rejects.toThrow();
    });
  });

  describe('Create', () => {
    it('should create a todo entity successfully ', async () => {
      // Arrange
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };
      // Act: rodar os tests
      const result = await todoController.create(body);

      // Assert
      expect(result).toEqual(newTodoEntity);
      expect(todoService.create).toHaveBeenCalledTimes(1);
      expect(todoService.create).toHaveBeenCalledWith(body);
    });

    it('throw an Exception ', async () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };
      jest.spyOn(todoService, 'create').mockRejectedValueOnce(new Error());
      expect(todoController.create(body)).rejects.toThrow();
    });
  });

  describe('Show', () => {
    it('should get a todo item successfully', async () => {
      const result = await todoController.show('1');
      expect(result).toEqual(todoEntityList[0]);
      expect(todoService.findOneOrFail).toHaveBeenCalledWith('1');
      expect(todoService.findOneOrFail).toHaveBeenCalledTimes(1);
    });
    it('throw an Exception ', async () => {
      const body: CreateTodoDto = {
        task: 'new-task',
        isDone: 0,
      };
      jest
        .spyOn(todoService, 'findOneOrFail')
        .mockRejectedValueOnce(new Error());
      expect(todoController.show('1')).rejects.toThrow();
    });
  });

  describe('Update', () => {
    it('should update a todo item successfully', async () => {
      const body: UpdateTodoDto = {
        task: 'as-task',
        isDone: 0,
      };
      const ID = '1';
      const result = await todoController.udpate(ID, body);

      expect(result).toEqual(newTodoEntity);
    });
    it('throw an Exception ', async () => {
      const body: UpdateTodoDto = {
        task: 'as-task',
        isDone: 0,
      };
      const ID = '1';
      jest.spyOn(todoService, 'update').mockRejectedValueOnce(new Error());
      expect(todoController.udpate(ID, body)).rejects.toThrow();
    });
  });
  describe('deleteById', () => {
    it('should delete a todo item successfully', async () => {
      const ID = '1';
      const result = await todoController.destroy(ID);
      expect(result).toBeUndefined();
    });
    it('throw an Exception ', async () => {
      const ID = '1';
      jest.spyOn(todoService, 'deleteById').mockRejectedValueOnce(new Error());
      expect(todoController.destroy(ID)).rejects.toThrow();
    });
  });
});
