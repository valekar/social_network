import { User, IUser } from "@models";
import bcrypt from "bcrypt";

export interface IUserDao {
  getOne: (email: string) => Promise<IUser | null>;
  getAll: () => Promise<IUser[]>;
  add: (user: IUser) => Promise<IUser>;
  update: (user: IUser) => Promise<void>;
  delete: (id: number) => Promise<void>;
}

export class UserDao implements IUserDao {
  /**
   * @param email
   */
  public async getOne(email: string): Promise<IUser | null> {
    try {
      const user = await User.findOne({ email });
      return user;
    } catch (err) {
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
    // TODO

    try {
      const newUser = new User({
        name: user.name,

        password: user.password,
        email: user.email
      });

      return await newUser.save();
    } catch (err) {
      throw err;
    }
  }

  /**
   *
   * @param user
   */
  public async update(user: IUser): Promise<void> {
    try {
      // tslint:disable-next-line: prefer-const
      let updateUser = await User.findById(user._id);
      if (updateUser != null) {
        updateUser.name = user.name;
        updateUser.email = user.email;
        updateUser.password = await bcrypt.hash(user.password, 10);
        await updateUser.save();
      }
      throw new Error("user not found");
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
