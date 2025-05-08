import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class BookService {
  constructor(private client: PrismaService) {}
  async create(data: CreateBookDto) {
    let author = await this.client.author.findUnique({
      where: { id: data.authorId },
    });
    if (!author) throw new NotFoundException('author not found');

    let created = await this.client.book.create({
      data,
      include: { author: true },
    });
    return created;
  }

  async findAll(page: number, limit: number, filter: string, authorId: number) {
    let take = limit || 10;
    let skip = page ? (page - 1) * limit : 0;
    let where: any = {};
    if (filter) {
      where.name = {
        startWith: filter,
      };
    }
    if (authorId) {
      where.authorId = authorId;
    }
    let books = await this.client.book.findMany({
      where,
      skip,
      take,
      include: { author: true },
    });
    return books;
  }

  async findOne(id: number) {
    let one = await this.client.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!one) throw new NotFoundException('book not found');
    return one;
  }

  async update(id: number, data: UpdateBookDto) {
    let one = await this.client.book.findUnique({
      where: { id },
      include: { author: true },
    });
    if (!one) throw new NotFoundException('book not found');
    let updated = await this.client.book.update({
      where: { id },
      data,
    });
    return updated;
  }

  async remove(id: number) {
    let one = await this.client.book.findUnique({ where: { id } });
    if (!one) throw new NotFoundException('book not found');
    let deleted = await this.client.book.delete({
      where: { id },
      include: { author: true },
    });
    return deleted;
  }
}
