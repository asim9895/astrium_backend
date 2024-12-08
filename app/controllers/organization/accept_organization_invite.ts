import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";

export const accept_organization_invite = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { organization_id, email } = req.body;

  try {
    if (req?.user?.email !== email) {
      return res
        .status(http_status.unauthorized)
        .json(
          ErrorResponse(
            http_status.unauthorized,
            `Invite is not sent to this account, please login with email address: ${email}`
          )
        );
    }
    const find_user = await prisma_client.user.findFirst({
      where: { email },
    });

    const find_organization = await prisma_client.organization.findFirst({
      where: { organization_id },
    });

    if (!find_organization) {
      return res
        .status(http_status.bad_request)
        .json(
          ErrorResponse(http_status.bad_request, "Organization does not exists")
        );
    }

    const find_org_to_user_relation =
      await prisma_client.organizationToUser.findFirst({
        where: {
          organization_id,
          is_active: false,
          user_id: null,
          invite_email: email,
          status: "PENDING",
        },
      });

    if (find_org_to_user_relation) {
      await prisma_client.organizationToUser.update({
        where: {
          organization_to_user_id:
            find_org_to_user_relation?.organization_to_user_id,
          organization_id,
          is_active: false,
          user_id: null,
          invite_email: email,
        },
        data: {
          status: "ACCEPTED",
          invite_accepted_time: new Date().toISOString(),
          user_id: find_user?.user_id,
          is_active: true,
        },
      });
    } else {
      return res
        .status(http_status.bad_request)
        .json(ErrorResponse(http_status.bad_request, "Invite was not found"));
    }

    res
      .status(http_status.ok)
      .json(
        SuccessResponse(http_status.ok, "Invite accepted successfully", null)
      );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
