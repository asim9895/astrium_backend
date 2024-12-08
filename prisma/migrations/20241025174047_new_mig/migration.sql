/*
  Warnings:

  - A unique constraint covering the columns `[org_slug]` on the table `organizations` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "organizations" ADD COLUMN     "org_slug" TEXT;

-- AlterTable
ALTER TABLE "projects" ADD COLUMN     "proj_slug" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organizations_org_slug_key" ON "organizations"("org_slug");

-- CreateIndex
CREATE INDEX "organizations_org_slug_idx" ON "organizations"("org_slug");
