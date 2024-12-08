/*
  Warnings:

  - You are about to drop the column `invite_accepted` on the `organization_to_users` table. All the data in the column will be lost.
  - You are about to drop the column `invite_sent` on the `organization_to_users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "organization_to_users" DROP COLUMN "invite_accepted",
DROP COLUMN "invite_sent";
