-- AlterTable
ALTER TABLE "organization_to_users" ALTER COLUMN "invite_accepted_time" DROP NOT NULL,
ALTER COLUMN "invite_sent_time" DROP NOT NULL;
