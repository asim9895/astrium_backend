import { validationResult } from "express-validator";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { Request, Response } from "express";
import { prisma_client } from "../../helpers/prisma_init";
import { match_password } from "../../helpers/bcrypt_password";
import jwt from "jsonwebtoken";

export const login_user = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if any input fields are missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { username_email, password } = req.body;

  try {
    // find user_input if matches with name or email
    const user = await prisma_client.user.findFirst({
      where: {
        OR: [{ name: username_email }, { email: username_email }],
      },
    });

    if (!user) {
      return res
        .status(http_status.bad_request)
        .json(ErrorResponse(http_status.bad_request, "Invalid Credentials"));
    }

    // check if password matched or not
    const isMatch = await match_password(user.password, password);

    if (!isMatch) {
      return res
        .status(http_status.bad_request)
        .json(ErrorResponse(http_status.bad_request, "Invalid Credentials"));
    }

    // create a jwt token for user to use in authentication
    jwt.sign(
      { id: user?.user_id },
      process.env.JWT_TOKEN,
      (err: any, token: string) => {
        if (err)
          return res
            .status(http_status.bad_request)
            .json(ErrorResponse(http_status.bad_request, err));
        res
          .status(http_status.ok)
          .json(
            SuccessResponse(http_status.ok, "Login Successfull", { token })
          );
      }
    );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
