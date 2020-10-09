import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book } from './book.model';

@Injectable()
export class BookService {
    constructor(
        @InjectModel('Book') private readonly bookModel: Model<Book>,
    ) { }

    async insertBook(
        title: string,
        description: string,
        author: string,
        isPrivate: boolean,
        publicationDate: Date,
        cover: Buffer,
    ) {
        const newBook = new this.bookModel({
            title,
            description,
            author,
            isPrivate,
            publicationDate,
            cover,
        });
        const result = await newBook.save();
        return result.id as string;
    }

    async getBooks(request) {
        if (request.headers.authorization !== undefined) {
            const books = await this.bookModel.find().exec();
            return books.map(b => ({
                id: b.id,
                title: b.title,
                description: b.description,
                author: b.author,
                isPrivate: b.isPrivate,
                publicationDate: b.publicationDate,
                cover: b.cover,
            }));
        } else {
            const books = await this.bookModel.find({ isPrivate: false }).exec();
            return books.map(b => ({
                id: b.id,
                title: b.title,
                description: b.description,
                author: b.author,
                isPrivate: b.isPrivate,
                publicationDate: b.publicationDate,
                cover: b.cover,
            }));
        }
    }

    async getSingleBook(BookId: string) {
        const b = await this.findBook(BookId);
        return {
            id: b.id,
            title: b.title,
            description: b.description,
            author: b.author,
            isPrivate: b.isPrivate,
            publicationDate: b.publicationDate,
            cover: b.cover,
        };
    }

    async updateBook(
        BookId: string,
        title: string,
        description: string,
        author: string,
        isPrivate: boolean,
        publicationDate: Date,
        cover: Buffer,
    ) {
        const updatedBook = await this.findBook(BookId);
        if (title) {
            updatedBook.title = title;
        }
        if (description) {
            updatedBook.description = description;
        }
        if (author) {
            updatedBook.author = author;
        }
        if (isPrivate) {
            updatedBook.isPrivate = isPrivate;
        }
        if (publicationDate) {
            updatedBook.publicationDate = publicationDate;
        }
        if (cover) {
            updatedBook.cover = cover;
        }
        updatedBook.save();
    }

    async deleteBook(bookId: string) {
        const result = await this.bookModel.deleteOne({ _id: bookId }).exec();
        if (result.n === 0) {
            throw new NotFoundException('Could not find Book.');
        }
    }

    private async findBook(id: string): Promise<Book> {
        let book;
        try {
            book = await this.bookModel.findById(id).exec();
        } catch (error) {
            throw new NotFoundException('Could not find Book.');
        }
        if (!book) {
            throw new NotFoundException('Could not find Book.');
        }
        return book;
    }
}