import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import paginate from 'mongoose-paginate-v2';

import { CategoryEntity } from '@/core/category/entity/category';

export type CategoryDocument = Document & CategoryEntity;

@Schema({
  collection: 'categories',
  autoIndex: true,
  timestamps: true
})
export class Category {
  @Prop({ type: String })
  _id!: string;

  @Prop({ min: 0, max: 200, required: true, type: String })
  name!: string;

  @Prop({ min: 0, max: 200, required: true, type: String })
  slug!: string;

  @Prop({ type: Date, default: null })
  deletedAt!: Date;
}

const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.index({ name: 1 }, { partialFilterExpression: { deletedAt: { $eq: null } } });

CategorySchema.plugin(paginate);

CategorySchema.virtual('id').get(function () {
  return this._id;
});

export { CategorySchema };
