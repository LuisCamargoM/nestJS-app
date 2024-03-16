import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';
import { TodoService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IndexTodoSwagger } from './swagger/index-todo.swagger';

@Controller('api/v1/todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as tarefas' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tarefas retornada com sucesso',
    type: IndexTodoSwagger,
    isArray:true
  })
  async index() {
    return await this.todoService.findAll();
  }

  @Post()
  @ApiResponse({
    status: 201,
    description: 'Nova tarefa criada com sucesso',
    type: IndexTodoSwagger,
  })
  @ApiResponse({
    status: 400,
    description: 'Parametros inválidos',
  })
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  async create(@Body() body: CreateTodoDto) {
    return await this.todoService.create(body);
  }

  @Get(':id')
  @ApiResponse({
    status: 201,
    description: 'Dados de uma tarefa retornado com sucesso',
  })
  @ApiResponse({ status: 404, description: 'Task não foi encontrada' })
  @ApiOperation({ summary: 'Lista uma única tarefa' })
  async show(@Param('id', new ParseUUIDPipe()) id: string) {
    return await this.todoService.findOneOrFail(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma única tarefa' })
  @ApiResponse({ status: 201, description: 'Tarefa atualizada com sucesso' })
  @ApiResponse({ status: 404, description: 'Task não foi encontrada' })
  async udpate(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() body: UpdateTodoDto,
  ) {
    return await this.todoService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deleta uma única tarefa' })
  @ApiResponse({ status: 204, description: 'Tarefa removida com sucesso' })
  @ApiResponse({ status: 404, description: 'Task não foi encontrada' })
  async destroy(@Param('id', new ParseUUIDPipe()) id: string) {
    await this.todoService.deleteById(id);
  }
}
