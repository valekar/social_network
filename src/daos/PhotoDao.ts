import { IPhoto, Photo } from "@models";
import {
  ResourceNotFoundError,
  DatabaseError,
  ResourceAlreadyExistsError
} from "@errors";

export interface IPhotoDao {
  getOne: (value: string) => Promise<IPhoto | null>;
  getAll: () => Promise<IPhoto[]>;
  add: (Photo: IPhoto) => Promise<IPhoto>;
  update: (Photo: IPhoto, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class PhotoDao implements IPhotoDao {
  public async getOne(value: string): Promise<IPhoto | null> {
    try {
      const photo = await Photo.findOne({ _id: value });
      return photo;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IPhoto[]> {
    try {
      const Photos = await Photo.find();
      return Photos;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(photo: IPhoto): Promise<IPhoto> {
    try {
      const newPhoto = new Photo({
        title: photo.title,
        photoUrl: photo.photoUrl,
        abuse: photo.abuse,
        active: photo.active
      });
      const result = await newPhoto.save();
      return result;
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw new DatabaseError(err);
    }
  }
  public async update(photo: IPhoto, id: string): Promise<void> {
    try {
      let updatePhoto = await Photo.findById(id);

      if (updatePhoto) {
        if (photo.title) {
          updatePhoto.title = photo.title;
        }
        if (photo.photoUrl) {
          updatePhoto.photoUrl = photo.photoUrl;
        }
        if (photo.abuse) {
          updatePhoto.abuse = photo.abuse;
        }
        if (photo.active) {
          updatePhoto.active = photo.active;
        }
        await updatePhoto.save();
      } else {
        throw new ResourceNotFoundError("Photo not found");
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
      let deletePhoto = await Photo.findByIdAndDelete(id);
      if (!deletePhoto) {
        throw new ResourceNotFoundError(
          "Could not delete Photo, Photo not found"
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
