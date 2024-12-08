/*
  Warnings:

  - The primary key for the `organization_to_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `invite_accepted_time` to the `organization_to_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invite_email` to the `organization_to_users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `invite_sent_time` to the `organization_to_users` table without a default value. This is not possible if the table is not empty.
  - The required column `organization_to_user_id` was added to the `organization_to_users` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "organization_to_users" DROP CONSTRAINT "organization_to_users_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "organization_to_users" DROP CONSTRAINT "organization_to_users_user_id_fkey";

-- AlterTable
ALTER TABLE "organization_to_users" DROP CONSTRAINT "organization_to_users_pkey",
ADD COLUMN     "invite_accepted_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "invite_email" TEXT NOT NULL,
ADD COLUMN     "invite_sent_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "organization_to_user_id" TEXT NOT NULL,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "organization_id" DROP NOT NULL,
ADD CONSTRAINT "organization_to_users_pkey" PRIMARY KEY ("organization_to_user_id");

-- AddForeignKey
ALTER TABLE "organization_to_users" ADD CONSTRAINT "organization_to_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_to_users" ADD CONSTRAINT "organization_to_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE SET NULL ON UPDATE CASCADE;
