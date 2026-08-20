import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCamperDto } from './dto/create-camper.dto';
import { QueryCamperDto } from './dto/query-camper.dto';

@Injectable()
export class CampersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCamperDto) {
    const settings = await this.prisma.registrationSettings.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: {},
    });

    if (!settings.isOpen) {
      throw new BadRequestException('Registration is closed.');
    }

    try {
      return await this.prisma.camper.create({
        data: {
          ...dto,
          invitedBy: dto.invitedBy ?? '',
          medicalConditions: dto.medicalConditions ?? '',
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

  async registrationStatus() {
    const settings = await this.prisma.registrationSettings.upsert({
      where: { id: 1 },
      create: { id: 1 },
      update: {},
    });

    return { isOpen: settings.isOpen };
  }

  async updateRegistrationStatus(isOpen: boolean) {
    if (typeof isOpen !== 'boolean') {
      throw new BadRequestException('isOpen must be a boolean.');
    }

    const settings = await this.prisma.registrationSettings.upsert({
      where: { id: 1 },
      create: { id: 1, isOpen },
      update: { isOpen },
    });

    return { isOpen: settings.isOpen };
  }

  findAll(query: QueryCamperDto) {
    const where: Prisma.CamperWhereInput = {};

    if (query.area) {
      where.area = query.area;
    }

    if (query.age !== undefined) {
      where.age = query.age;
    }

    if (query.gender) {
      where.gender = { equals: query.gender, mode: 'insensitive' };
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
    const [total, byArea, byAge, byGender] = await Promise.all([
      this.prisma.camper.count(),
      this.prisma.camper.groupBy({
        by: ['area'],
        _count: { area: true },
      }),
      this.prisma.camper.groupBy({
        by: ['age'],
        _count: { age: true },
        orderBy: { age: 'asc' },
      }),
      this.prisma.camper.groupBy({
        by: ['gender'],
        _count: { gender: true },
        orderBy: { gender: 'asc' },
      }),
    ]);

    return {
      total,
      byArea: byArea.map((a) => ({ area: a.area, count: a._count.area })),
      byAge: byAge.map((a) => ({ age: a.age, count: a._count.age })),
      byGender: byGender.map((g) => ({ gender: g.gender, count: g._count.gender })),
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
