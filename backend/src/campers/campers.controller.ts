import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { CampersService } from './campers.service';
import { CreateCamperDto } from './dto/create-camper.dto';
import { QueryCamperDto } from './dto/query-camper.dto';

@Controller('campers')
export class CampersController {
  constructor(private readonly campersService: CampersService) {}

  @Post()
  create(@Body() dto: CreateCamperDto) {
    return this.campersService.create(dto);
  }

  @Get()
  findAll(@Query() query: QueryCamperDto) {
    return this.campersService.findAll(query);
  }

  @Get('stats')
  stats() {
    return this.campersService.stats();
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campersService.remove(id);
  }
}
