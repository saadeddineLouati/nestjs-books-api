import { Test } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';

describe('CatsController', () => {
  let bookController: BookController;
  let bookService: BookService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService],
    }).compile();

    bookService = moduleRef.get<BookService>(BookService);
    bookController = moduleRef.get<BookController>(BookController);
  });

  describe('findAll', () => {
    it('should return an array of cats', async () => {
      const result = ['test'];
      jest.spyOn(bookService, 'getBooks').mockImplementation(() => result);

      expect(await bookController.getAllBooks()).toBe(result);
    });
  });
});
