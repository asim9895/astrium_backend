-- AlterTable
ALTER TABLE "organization_to_users" ADD COLUMN     "invite_accepted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "invite_sent" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT false;
