import { prisma_client } from "../../helpers/prisma_init";
import { http_status } from "../../utils/http_status";
import {
  ErrorResponse,
  InputErrorResponse,
  SuccessResponse,
} from "../../utils/response";
import { validationResult } from "express-validator";
import { Prisma } from "@prisma/client";

export const all_organizations = async (req: any, res: any) => {
  const input_errors = validationResult(req);

  // check if there is any input missing
  if (!input_errors.isEmpty()) {
    return res
      .status(http_status.bad_request)
      .json(InputErrorResponse(http_status.bad_request, input_errors.array()));
  }

  const { per_page, page_number, search } = req.query;

  try {
    const searchFilter: Prisma.OrganizationWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: "insensitive" } }],
        }
      : {};

    // Fetch users with optional search and pagination
    const organizations = await prisma_client.organization.findMany({
      where: searchFilter,
      take: Number(per_page) || undefined,
      skip: Number((page_number - 1) * per_page) || undefined,
      orderBy: {
        updated_at: "desc",
      },
      include: {
        created_by_user: { select: { user_id: true, email: true, name: true } },
        modified_by_user: {
          select: { user_id: true, email: true, name: true },
        },
      },
    });

    // Count total users for pagination
    const total_organizations = await prisma_client.organization.count({
      where: searchFilter,
    });

    res.status(http_status.ok).json(
      SuccessResponse(http_status.ok, "Organizations found successfully", {
        organizations,
        total_organizations,
        per_page: per_page === undefined ? null : Number(per_page),
        page_number: page_number === undefined ? null : Number(page_number),
        total_pages: Math.ceil(total_organizations / per_page),
      })
    );
  } catch (error) {
    console.log(error);

    res
      .status(http_status.server_error)
      .json(ErrorResponse(http_status.server_error, error.message));
  }
};
