import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCamperDto } from './dto/create-camper.dto';
import { QueryCamperDto } from './dto/query-camper.dto';

@Injectable()
export class CampersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCamperDto) {
    try {
      return await this.prisma.camper.create({
        data: {
          ...dto,
          invitedBy: dto.invitedBy ?? '',
          availableDays: dto.availableDays ?? [],
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new InternalServerErrorException(
          `Database error while saving camper: ${error.message}`,
        );
      }
      throw new InternalServerErrorException('Unable to save camper registration.');
    }
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
        { invitedBy: { contains: query.search, mode: 'insensitive' } },
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

  async updateStatus(id: string, data: { busArrived?: boolean; campArrived?: boolean }) {
    const camper = await this.prisma.camper.findUnique({ where: { id } });
    if (!camper) {
      throw new NotFoundException('Camper not found.');
    }

    return this.prisma.camper.update({
      where: { id },
      data,
    });
  }
}
