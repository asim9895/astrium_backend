import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";

/**
 * Adds members to an organization.
 *
 * @param req - The HTTP request object containing the organization ID and member emails in the request body.
 * @param res - The HTTP response object to send the success or error response.
 * @returns A success response with the total members of the organization and the members that were invited, or an error response if there are input errors or the organization does not exist.
 */
export const add_organization_members = async (req: any, res: any) => {
  const input_errors = validationResult(req);
  const errors = input_errors.array();

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, errors));
  }

  const { organization_id, members } = req.body;

  try {
    let total_members_of_org: string[] = [];
    let members_invited: string[] = [];

    let find_organization = await prisma_client.organization.findFirst({
      where: { organization_id },
    });

    if (!find_organization) {
      return res
        .status(http_status.bad_request)
        .json(
          ErrorResponse(http_status.bad_request, "Organization does not exists")
        );
    }

    await prisma_client.$transaction(async (tx) => {
      for (let i = 0; i < members?.length; i++) {
        const find_member = await tx.user.findFirst({
          where: {
            email: members[i],
            is_active: true,
          },
        });

        if (find_member) {
          await tx.organizationToUser.create({
            data: {
              is_active: true,
              status: "ACCEPTED",
              invite_accepted_time: new Date().toISOString(),
              invite_sent_time: new Date().toISOString(),
              auto_added: true,
              invite_email: find_member?.email,
              user_id: find_member?.user_id,
              organization_id: organization_id,
            },
          });
          total_members_of_org.push(find_member.email);
        } else {
          await tx.organizationToUser.create({
            data: {
              is_active: false,
              status: "PENDING",
              invite_sent_time: new Date().toISOString(),
              auto_added: false,
              invite_email: members[i],
              organization_id: organization_id,
            },
          });
          members_invited.push(members[i]);
        }
      }
    });

    res.status(http_status.ok).json(
      SuccessResponse(http_status.ok, "Members added successfully", {
        total_members_of_org,
        members_invited,
      })
    );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
