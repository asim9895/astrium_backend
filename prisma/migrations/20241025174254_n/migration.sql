-- CreateEnum
CREATE TYPE "OrgToUserStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- AlterTable
ALTER TABLE "organization_to_users" ADD COLUMN     "status" "OrgToUserStatus" NOT NULL DEFAULT 'PENDING';
