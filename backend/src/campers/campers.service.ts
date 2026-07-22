import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCamperDto } from './dto/create-camper.dto';
import { QueryCamperDto } from './dto/query-camper.dto';

@Injectable()
export class CampersService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateCamperDto) {
    return this.prisma.camper.create({ data: dto });
  }

  findAll(query: QueryCamperDto) {
    const where: Prisma.CamperWhereInput = {};

    if (query.area) {
      where.area = query.area;
    }

    if (query.search) {
      where.OR = [
        { fullName: { contains: query.search, mode: 'insensitive' } },
        { mobileNumber: { contains: query.search, mode: 'insensitive' } },
        { school: { contains: query.search, mode: 'insensitive' } },
        { address: { contains: query.search, mode: 'insensitive' } },
        { parentsName: { contains: query.search, mode: 'insensitive' } },
        { religion: { contains: query.search, mode: 'insensitive' } },
      ];
    }

    return this.prisma.camper.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async stats() {
    const [total, byArea] = await Promise.all([
      this.prisma.camper.count(),
      this.prisma.camper.groupBy({
        by: ['area'],
        _count: { area: true },
      }),
    ]);

    return {
      total,
      byArea: byArea.map((a) => ({ area: a.area, count: a._count.area })),
    };
  }

  remove(id: string) {
    return this.prisma.camper.delete({ where: { id } });
  }
}
