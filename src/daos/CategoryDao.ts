import { ICategory, Category } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface ICategoryDao {
  getOne: (value: string) => Promise<ICategory | null>;
  getAll: () => Promise<ICategory[]>;
  add: (category: ICategory) => Promise<ICategory>;
  update: (category: ICategory, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class CategoryDao implements ICategoryDao {
  public async getOne(value: string): Promise<ICategory | null> {
    try {
      const category = await Category.findOne({ _id: value });
      return category;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<ICategory[]> {
    try {
      const categories = await Category.find();
      return categories;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(category: ICategory): Promise<ICategory> {
    try {
      const existingCategory = await Category.findOne({ name: category.name });

      if (existingCategory) {
        throw new ResourceAlreadyExistsError("Category Already exsits");
      } else {
        const newCategory = new Category({
          name: category.name,
          active: category.active
        });
        const result = await newCategory.save();
        return result;
      }
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(category: ICategory, id: string): Promise<void> {
    try {
      let updateCategory = await Category.findById(id);

      if (updateCategory) {
        if (category.name) {
          updateCategory.name = category.name;
        }
        if (category.active) {
          updateCategory.active = category.active;
        }
        await updateCategory.save();
      } else {
        throw new ResourceNotFoundError("Category not found");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async delete(id: string): Promise<void> {
    try {
      let deleteCategory = await Category.findByIdAndDelete(id);
      if (!deleteCategory) {
        throw new ResourceNotFoundError(
          "Could not delete Category, Category not found"
        );
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
}
