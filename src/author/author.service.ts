import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthorService {
  constructor(private client: PrismaService) {}
  async create(createAuthorDto: CreateAuthorDto) {
    let created = await this.client.author.create({ data: createAuthorDto });
    return created;
  }

  async findAll(page: number, limit: number, filter: string) {
    let take = limit || 10;
    let skip = page ? (page - 1) * limit : 0;
    let where: any = {};
    if (filter) {
      where.name = {
        startWith: filter,
      };
    }
    let authors = await this.client.author.findMany({where, skip, take})
    return authors
  }

  async findOne(id: number) {
    let one = await this.client.author.findUnique({where: {id}})
    if(!one) throw new NotFoundException("author not found")
    return one
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    let one = await this.client.author.findUnique({where: {id}})
    if(!one) throw new NotFoundException("author not found")
    let updated = await this.client.author.update({where: {id}, data: updateAuthorDto})
    return updated
  }

  async remove(id: number) {
    let one = await this.client.author.findUnique({where: {id}})
    if(!one) throw new NotFoundException("author not found")
    let deleted = await this.client.author.delete({where: {id}})
    return deleted
  }
}
