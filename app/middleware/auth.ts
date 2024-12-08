import { prisma_client } from "../helpers/prisma_init";
import { http_status } from "../utils/http_status";
import { ErrorResponse } from "../utils/response";
import jwt from "jsonwebtoken";

export const auth = async (req: any, res: any, next: any) => {
  const authorization = req.headers.authorization;
  try {
    if (!authorization) {
      return res
        .status(http_status.unauthorized)
        .json(ErrorResponse(http_status.unauthorized, "Unauthorized"));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = jwt.verify(authorization, process.env.JWT_TOKEN);

    // validate if token not correct
    if (!decoded) {
      res
        .status(http_status.unauthorized)
        .json(ErrorResponse(http_status.unauthorized, "Unauthorized"));
    }

    const find_user = await prisma_client.user.findUnique({
      where: { user_id: decoded?.id, is_active: true },
      select: { user_id: true, email: true },
    });

    // validate if no user found
    if (!find_user) {
      res.status(400).json(ErrorResponse(400, "Unauthorized"));
    }

    req.user = find_user;
    next();
  } catch (error) {
    if (error?.name === "JsonWebTokenError") {
      return res
        .status(http_status.unauthorized)
        .json(ErrorResponse(http_status.unauthorized, "Unauthorized"));
    }

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, "Server Error"));
  }
};
