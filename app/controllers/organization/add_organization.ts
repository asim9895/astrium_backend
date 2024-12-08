import slugify from "slugify";
import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";

export const add_organization = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { name, description, members } = req.body;

  try {
    let total_members_of_org: string[] = [];
    let members_invited: string[] = [];

    let find_organization = await prisma_client.organization.findFirst({
      where: { name },
    });

    if (find_organization) {
      return res
        .status(http_status.bad_request)
        .json(
          ErrorResponse(
            http_status.bad_request,
            "Organization Name already Exists"
          )
        );
    }

    await prisma_client.$transaction(async (tx) => {
      // 1. Decrement amount from the sender.
      const new_organization = await tx.organization.create({
        data: {
          name,
          description,
          org_slug: slugify(name),
          created_by: req?.user !== null ? req?.user?.user_id : null,
          modified_by: req?.user !== null ? req?.user?.user_id : null,
        },
      });

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
              organization_id: new_organization?.organization_id,
              is_admin:
                req?.user?.user_id === find_member?.user_id ? true : false,
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
              organization_id: new_organization?.organization_id,
            },
          });
          members_invited.push(members[i]);
        }
      }
    });

    res.status(http_status.ok).json(
      SuccessResponse(http_status.ok, "Organization Created Successfully", {
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
