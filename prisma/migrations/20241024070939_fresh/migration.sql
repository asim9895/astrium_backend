/*
  Warnings:

  - You are about to drop the `_OrganizationToUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProjectToUser` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_OrganizationToUser" DROP CONSTRAINT "_OrganizationToUser_B_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProjectToUser" DROP CONSTRAINT "_ProjectToUser_B_fkey";

-- DropTable
DROP TABLE "_OrganizationToUser";

-- DropTable
DROP TABLE "_ProjectToUser";

-- CreateTable
CREATE TABLE "organization_to_users" (
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "organization_to_users_pkey" PRIMARY KEY ("user_id","organization_id")
);

-- CreateTable
CREATE TABLE "project_to_users" (
    "project_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "project_to_users_pkey" PRIMARY KEY ("project_id","user_id")
);

-- AddForeignKey
ALTER TABLE "organization_to_users" ADD CONSTRAINT "organization_to_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_to_users" ADD CONSTRAINT "organization_to_users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("organization_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_to_users" ADD CONSTRAINT "project_to_users_project_id_fkey" FOREIGN KEY ("project_id") REFERENCES "projects"("project_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "project_to_users" ADD CONSTRAINT "project_to_users_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;
