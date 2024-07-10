import { Request } from "express";

interface UserRequest extends Request {
  user?: Record<string, any>;
}

export default UserRequest;
