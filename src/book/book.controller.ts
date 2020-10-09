import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
    UseGuards,
    Request,
    Req,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

import { BookService } from './book.service';

@Controller('books')
export class BookController {
    constructor(private readonly booksService: BookService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    async addBook(
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('author') author: string,
        @Body('isPrivate') isPrivate: boolean,
        @Body('publicationDate') publicationDate: Date,
        @Body('cover') cover: Buffer,
    ) {
        const generatedId = await this.booksService.insertBook(
            title,
            description,
            author,
            isPrivate,
            publicationDate,
            cover,
        );
        return { id: generatedId };
    }

    @Get()
    async getAllBooks(
        @Req() request: Request,
    ) {
        const books = await this.booksService.getBooks(request);
        return books;
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getBook(@Param('id') bookId: string) {
        return this.booksService.getSingleBook(bookId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    async updateBook(
        @Param('id') bookId: string,
        @Body('title') title: string,
        @Body('description') description: string,
        @Body('author') author: string,
        @Body('isPrivate') isPrivate: boolean,
        @Body('publicationDate') publicationDate: Date,
        @Body('cover') cover: Buffer,
    ) {
        const book = await this.booksService.updateBook(
            bookId,
            title,
            description,
            author,
            isPrivate,
            publicationDate,
            cover,
        );
        return { "message": "Book is updated" };
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async removeBook(@Param('id') bookId: string) {
        await this.booksService.deleteBook(bookId);
        return { "message": "Book is deleted" };
    }
}
