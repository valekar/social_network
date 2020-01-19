import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { BAD_REQUEST, OK, UNAUTHORIZED } from "http-status-codes";
import { UserDao } from "@daos";

var Linkedin = require("node-linkedin");

import {
  paramMissingError,
  loginFailedErr,
  logger,
  jwtCookieProps,
  JwtService
} from "@shared";

const router = Router();
const userDao = new UserDao();
const jwtService = new JwtService();

/******************************************************************************
 *                      Login User - "POST /api/auth/login"
 ******************************************************************************/

router.post("/login", async (req: Request, res: Response) => {
  try {
    // Check email and password present
    const { email, password } = req.body;
    if (!(email && password)) {
      return res.status(BAD_REQUEST).json({
        error: paramMissingError
      });
    }
    // Fetch user
    const user = await userDao.getOneByEmail(email);
    if (!user) {
      return res.status(UNAUTHORIZED).json({
        error: loginFailedErr
      });
    }
    // Check password
    const pwdPassed = await bcrypt.compare(password, user.password);
    if (!pwdPassed) {
      return res.status(UNAUTHORIZED).json({
        error: loginFailedErr
      });
    }
    // Setup Admin Cookie
    const jwt = await jwtService.getJwt({
      //role: user.role,
      id: user.id
    });

    res.header("auth-token", jwt);
    // Return
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                      Logout - "GET /api/oauth/linkedin"
 ******************************************************************************/
router.get("/oauth/linkedin", async (req: Request, res: Response) => {
  try {
    const scope = ["r_basicprofile", "r_emailaddress", "w_member_social"];
    const linkedin = Linkedin(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "http://localhost:3000/api/oauth/linkedin/callback"
    );

    linkedin.auth.authorize(res, scope);
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({ error: err.message });
  }
});

/******************************************************************************
 *                      Logout - "GET /api/oauth/linkedin"
 ******************************************************************************/
router.get("/oauth/linkedin/callback", async (req: Request, res: Response) => {
  try {
    const linkedin = new Linkedin(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "http://localhost:3000/api/oauth/linkedin/callback"
    );
    linkedin.auth.getAccessToken(
      res,
      req.query.code,
      req.query.state,
      async (err: any, results: any) => {
        const { access_token: accessToken } = results;

        if (accessToken) {
          const linkedin_local = Linkedin.init(accessToken);

          linkedin_local.people.me((error: any, $in: any) => {
            return res.status(200).json(JSON.stringify($in));
          });

          // linkedin_local.people.email((error: any, email: any) => {
          //   return res.status(200).json(JSON.stringify(email));
          // });
        }

        return res.redirect("/");
      }
    );
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({ error: err.message });
  }
});

/******************************************************************************
 *                      Logout - "GET /api/auth/logout"
 ******************************************************************************/

router.get("/logout", async (req: Request, res: Response) => {
  try {
    const { key, options } = jwtCookieProps;
    res.clearCookie(key, options);
    return res.status(OK).end();
  } catch (err) {
    logger.error(err.message, err);
    return res.status(BAD_REQUEST).json({
      error: err.message
    });
  }
});

/******************************************************************************
 *                                 Export Router
 ******************************************************************************/

export default router;
