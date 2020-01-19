import bcrypt from "bcrypt";
import { SuperTest, Test } from "supertest";
import { UserDao } from "@daos";
import { pwdSaltRounds } from "@shared";
import { User } from "@models";

const creds = {
  email: "jsmith@gmail.com",
  password: "Password@1"
};

export const login = (beforeAgent: SuperTest<Test>, done: any) => {
  // Setup dummy data
  const pwdHash = bcrypt.hashSync(creds.password, pwdSaltRounds);
  const loginUser = new User({
    name: "john smith",
    email: creds.email,
    password: pwdHash
  });
  spyOn(UserDao.prototype, "getOneByEmail").and.returnValue(
    Promise.resolve(loginUser)
  );
  // Call Login API
  beforeAgent
    .post("/api/auth/login")
    .type("form")
    .send(creds)
    .end((err: Error, res: any) => {
      if (err) {
        throw err;
      }
      done(res.headers["set-cookie"]);
    });
};
