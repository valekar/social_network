import { User, IUser } from "@models";
import bcrypt from "bcrypt";
import { ResourceAlreadyExistsError, ResourceNotFoundError } from "@errors";

export interface IUserDao {
  getOneByEmail: (email: string) => Promise<IUser | null>;
  getOneById: (id: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<IUser>;
  update: (user: IUser, id: String) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class UserDao implements IUserDao {
  /**
   * @param email
   */
  public async getOneByEmail(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email: email });
      return user;
    } catch (err) {
      throw err;
    }
  }

  public async getOneById(id: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ _id: id });
      if (user) {
        return user;
      } else {
        throw new ResourceNotFoundError("User not found");
      }
    } catch (err) {
      if (err instanceof ResourceNotFoundError) {
        throw new ResourceNotFoundError(err.message);
      }
      throw err;
    }
  }

  /**
   *
   */
  public async getAll(): Promise<IUser[]> {
    try {
      return await User.find();
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param user
   */
  public async add(user: IUser): Promise<IUser> {
    try {
      const existingUser = User.findOne({ email: user.email });
      if (!existingUser) {
        const newUser = new User({
          name: user.name,
          password: await bcrypt.hash(user.password, 10),
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          abuse: user.abuse,
          groups: user.groups,
          phoneNumber: user.phoneNumber
        });
        return await newUser.save();
      } else {
        throw new ResourceAlreadyExistsError("User already exists");
      }
    } catch (err) {
      if (err instanceof ResourceAlreadyExistsError) {
        throw new ResourceAlreadyExistsError(err.message);
      }
      throw err;
    }
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser, id: String): Promise<void> {
    try {
      // tslint:disable-next-line: prefer-const
      let updateUser = await User.findById(id);
      if (updateUser != null) {
        if (user.name) {
          updateUser.name = user.name;
        }

        if (user.password) {
          updateUser.password = await bcrypt.hash(user.password, 10);
        }
        if (user.firstName) {
          updateUser.firstName = user.firstName;
        }
        if (user.lastName) {
          updateUser.lastName = user.lastName;
        }
        if (user.phoneNumber) {
          updateUser.phoneNumber = user.phoneNumber;
        }
        if (user.abuse) {
          updateUser.abuse = user.abuse;
        }
        if (user.active) {
          updateUser.active = user.active;
        }
        if (user.groups) {
          updateUser.groups = user.groups;
        }
        updateUser.updatedAt = Date.now();
        await updateUser.save();
      } else {
        throw new Error("user not found");
      }
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param id
   */
  public async delete(id: number): Promise<void> {
    try {
      const result = await User.findByIdAndDelete(id);
      if (result == null) {
        throw Error("Could not delete the user");
      }
    } catch (err) {
      throw err;
    }
  }
}
