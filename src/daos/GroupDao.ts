import { Group, IGroup } from "@models";
import { ResourceNotFoundError, DatabaseError } from "@errors";

export interface IGroupDao {
  getOne: (value: string) => Promise<IGroup | null>;
  getAll: () => Promise<IGroup[]>;
  add: (group: IGroup) => Promise<IGroup>;
  update: (Group: IGroup, id: string) => Promise<void>;
  delete: (id: string) => Promise<void>;
}

export class GroupDao implements IGroupDao {
  public async getOne(value: string): Promise<IGroup | null> {
    try {
      const group = await Group.findOne({ _id: value });
      return group;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async getAll(): Promise<IGroup[]> {
    try {
      const groups = await Group.find();
      return groups;
    } catch (err) {
      throw new ResourceNotFoundError(err);
    }
  }
  public async add(group: IGroup): Promise<IGroup> {
    try {
      const newGroup = new Group({
        name: group.name,
        value: group.value
      });
      const result = await newGroup.save();
      return result;
    } catch (err) {
      throw new DatabaseError(err);
    }
  }
  public async update(group: IGroup, id: string): Promise<void> {
    try {
      let updateGroup = await Group.findById(id);
      if (updateGroup) {
        if (group.name) {
          updateGroup.name = group.name;
        }
        if (group.value) {
          updateGroup.value = group.value;
        }
        await updateGroup.save();
      } else {
        throw new ResourceNotFoundError("Group not found");
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
      let deleteGroup = await Group.findByIdAndDelete(id);
      if (!deleteGroup) {
        throw new ResourceNotFoundError(
          "Could not delete Group, Group not found"
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
