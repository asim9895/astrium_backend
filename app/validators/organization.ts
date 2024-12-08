import { body, param, query } from "express-validator";

export const accept_organization_invite_validation: any[] = [
  body("organization_id", "Organization ID is required").not().isEmpty(),
  body("email", "Email is required").not().isEmpty(),
];

export const reject_organization_invite_validation: any[] = [
  body("organization_id", "Organization ID is required").not().isEmpty(),
];

export const add_organization_members_validation: any[] = [
  body("organization_id", "Organization ID is required").not().isEmpty(),
  body("members", "Members is required")
    .not()
    .isEmpty()
    .isArray({ min: 1 })
    .withMessage("Members must be an array"),
];

export const add_organization_validation: any[] = [
  body("name", "Name is required").not().isEmpty(),
  body("members", "Members is required")
    .not()
    .isEmpty()
    .isArray({ min: 1 })
    .withMessage("Members must be an array"),
];

export const all_organization_validation: any[] = [
  query("per_page", "Per page is required").optional(),
  query("page_number", "Page number is required").optional(),
  query("search", "Search is required").optional(),
];

export const organization_members_validation: any[] = [
  param("organization_id", "Organization ID is required").not().isEmpty(),
  query("status", "Status is required").optional(),
];
