import { Router } from "express";
import { add_organization } from "../controllers/organization/add_organization";
import { accept_organization_invite } from "../controllers/organization/accept_organization_invite";
import { all_organizations } from "../controllers/organization/all_organization";
import { organization_members } from "../controllers/organization/organization_members";
import {
  accept_organization_invite_validation,
  organization_members_validation,
  add_organization_validation,
  all_organization_validation,
  reject_organization_invite_validation,
  add_organization_members_validation,
} from "../validators/organization";
import { reject_organization_invite } from "../controllers/organization/reject_organization_invite";
import { auth } from "../middleware/auth";
import { add_organization_members } from "../controllers/organization/add_organization_members";

const router = Router();

router.post(
  "/add-organization",
  auth,
  add_organization_validation,
  add_organization
);
router.post(
  "/add-organization-members",
  auth,
  add_organization_members_validation,
  add_organization_members
);
router.get(
  "/all-organizations",
  auth,
  all_organization_validation,
  all_organizations
);
router.post(
  "/accept-organization-invite",
  auth,
  accept_organization_invite_validation,
  accept_organization_invite
);
router.post(
  "/reject-organization-invite",
  auth,
  reject_organization_invite_validation,
  reject_organization_invite
);
router.get(
  "/organization-members/:organization_id",
  auth,
  organization_members_validation,
  organization_members
);

export default router;
