import { Request } from "express";
import { Response } from "express";
import { NextFunction } from "express";
import CustomError from "./error_handler.middleware";
import { decodeToken, generateToken } from "../utils/jwt.utils";
import User from "../models/user.model";
import { Role } from "../@types/enum.types";

export const authenticate = (roles?:Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookie = req.cookies ?? {};

      const token = cookie["access_token"];

      console.log("access_token", token);
      if (!token) {
        throw new CustomError("Unauthorised. Access denied", 401);
      }
      const decodedData = decodeToken(token);
      console.log(decodedData);

      if (!decodedData) {
        throw new CustomError("Unauthorised. Access denied", 401);
      }
      if (decodedData?.exp && decodedData?.exp * 1000 < Date.now()) {
        res.clearCookie("access_token", {
          sameSite: "none",
          httpOnly: true,
          secure: process.env.NODE_ENV === "development" ? false : true,
          maxAge: Date.now(),
        });
        throw new CustomError("Unauthorised. Access denied", 401);
      }
      const user = await User.findOne({
        _id: decodedData?._id,
        email: decodedData?.email,
      });
      if (!user) {
        res.clearCookie("access_token", {
          sameSite: "none",
          httpOnly: true,
          secure: process.env.NODE_ENV === "development" ? false : true,
          maxAge: Date.now(),
        });
        throw new CustomError("Unauthorised. Access denied", 401);
      }
      if(roles && roles.length > 0 && !roles.includes(user.role)){
        throw new CustomError("Forbidden. Access Denied",403);
      }
      req.user = {
        _id: user._id,
        email: user.email as string,
        first_name: user.first_name as string,
        last_name: user.last_name as string,
        role: user.role

      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
