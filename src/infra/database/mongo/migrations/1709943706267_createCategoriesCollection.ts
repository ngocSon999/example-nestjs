import { MigrationInterface } from 'mongo-migrate-ts';
import { Db } from 'mongodb';

export class CreateCategoryCollection1709943706267 implements MigrationInterface {
  async up(db: Db): Promise<void> {
    await db.createCollection('categories');
  }

  async down(db: Db): Promise<void> {
    await db.dropCollection('categories');
  }
}
