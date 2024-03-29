import { ForbiddenException, Injectable } from '@nestjs/common';
import { EditBookmarkDTO, CreateBookmarkDTO } from './dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BookmarkService {
  constructor(private readonly prisma: PrismaService) {}

  async createBookmark(userId: number, dto: CreateBookmarkDTO) {
    const createdBookmark = await this.prisma.bookmark.create({
      data: {
        ...dto,
        userId,
      },
    });
    return createdBookmark;
  }

  getBookmarks(userId: number) {
    return this.prisma.bookmark.findMany({
      where: { userId },
    });
  }

  getBookmarksById(userId: number, bookmarkId: number) {
    return this.prisma.bookmark.findFirst({
      where: { id: bookmarkId, userId },
    });
  }

  async editBookmarkById(
    userId: number,
    bookmarkId: number,
    dto: EditBookmarkDTO,
  ) {
    const bookMark = await this.getBookmarksById(userId, bookmarkId);

    if (!bookMark) throw new ForbiddenException('Access to resources denied');

    return this.prisma.bookmark.update({
      where: { id: bookmarkId },
      data: {
        ...dto,
      },
    });
  }

  async deleteBookmarkById(userId: number, bookmarkId: number) {
    const bookMark = await this.getBookmarksById(userId, bookmarkId);

    if (!bookMark) throw new ForbiddenException('Access to resources denied');

    await this.prisma.bookmark.delete({
      where: { id: bookmarkId },
    });
  }
}
