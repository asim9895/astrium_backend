import { Prisma } from "@prisma/client";
import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";

export const organization_members = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { organization_id } = req.params;
  const { per_page, page_number, search, status } = req.query;

  try {
    const searchFilter: Prisma.OrganizationToUserWhereInput = search
      ? {
          OR: [
            { user: { email: { contains: search, mode: "insensitive" } } },
            { user: { name: { contains: search, mode: "insensitive" } } },
          ],
        }
      : {};
    const find_active_members = await prisma_client.organizationToUser.findMany(
      {
        where: {
          status: status,
          organization_id,
          ...searchFilter,
        },
        select: {
          status: true,
          is_active: true,
          is_admin: true,
          user: { select: { name: true, email: true, user_id: true } },
        },
        take: Number(per_page) || undefined,
        skip: Number((page_number - 1) * per_page) || undefined,
        orderBy: {
          updated_at: "desc",
        },
      }
    );
    // Count total users for pagination
    const total_active_members = await prisma_client.organizationToUser.count({
      where: {
        status: status,
        organization_id,
        ...searchFilter,
      },
    });

    res.status(http_status.ok).json(
      SuccessResponse(http_status.ok, "Members found successfully", {
        members: find_active_members,
        total_users: total_active_members,
        per_page: per_page === undefined ? null : Number(per_page),
        page_number: page_number === undefined ? null : Number(page_number),
        total_pages: Math.ceil(total_active_members / per_page),
      })
    );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
