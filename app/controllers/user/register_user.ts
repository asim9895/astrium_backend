import { encrypt_password } from "../../helpers/bcrypt_password";
import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";

export const register_user = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { name, email, password } = req.body;

  try {
    // find name of user so there is no duplicate entry in db
    const find_username = await prisma_client.user.findFirst({
      where: {
        name,
      },
    });

    // find email of user so there is no duplicate entry in db
    const find_email = await prisma_client.user.findFirst({
      where: {
        email,
      },
    });

    if (find_username) {
      return res
        .status(http_status.bad_request)
        .json(
          ErrorResponse(http_status.bad_request, "Username already in use")
        );
    }

    if (find_email) {
      return res
        .status(http_status.bad_request)
        .json(ErrorResponse(http_status.bad_request, "Email already in use"));
    }

    // create a new user in the database
    await prisma_client.user.create({
      data: {
        name,
        email,
        password: await encrypt_password(password),
        created_by: req?.user !== null ? req?.user?.user_id : null,
        modified_by: req?.user !== null ? req?.user?.user_id : null,
      },
    });

    res
      .status(http_status.ok)
      .json(
        SuccessResponse(
          http_status.ok,
          "Registeration Successfull",
          find_username
        )
      );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
