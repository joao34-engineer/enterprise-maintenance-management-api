/*
  Warnings:

  - The values [SHIPPED,DEPRECATED] on the enum `UPDATE_STATUS` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Update` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UpdatePoint` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
ALTER TABLE "public"."Update" ALTER COLUMN "status" DROP DEFAULT;
UPDATE "public"."Update"
SET "status" = 'IN_PROGRESS'
WHERE "status" IN ('SHIPPED', 'DEPRECATED');
CREATE TYPE "public"."UPDATE_STATUS_new" AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'EMERGENCY_REPAIR');
ALTER TABLE "public"."Update" ALTER COLUMN "status" TYPE "public"."UPDATE_STATUS_new" USING ("status"::text::"public"."UPDATE_STATUS_new");
ALTER TYPE "public"."UPDATE_STATUS" RENAME TO "UPDATE_STATUS_old";
ALTER TYPE "public"."UPDATE_STATUS_new" RENAME TO "UPDATE_STATUS";
DROP TYPE "public"."UPDATE_STATUS_old";
ALTER TABLE "public"."Update" ALTER COLUMN "status" SET DEFAULT 'IN_PROGRESS';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_belongsToid_fkey";

-- DropForeignKey
ALTER TABLE "public"."Update" DROP CONSTRAINT "Update_productId_fkey";

-- DropForeignKey
ALTER TABLE "public"."UpdatePoint" DROP CONSTRAINT "UpdatePoint_updateId_fkey";

-- DropTable
DROP TABLE "public"."Product";

-- DropTable
DROP TABLE "public"."Update";

-- DropTable
DROP TABLE "public"."UpdatePoint";

-- CreateTable
CREATE TABLE "public"."Asset" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "belongsToId" TEXT NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MaintenanceRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "status" "public"."UPDATE_STATUS" NOT NULL DEFAULT 'IN_PROGRESS',
    "version" TEXT,
    "asset" TEXT,
    "assetId" TEXT NOT NULL,

    CONSTRAINT "MaintenanceRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ChecklistTask" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "maintenanceRecordId" TEXT NOT NULL,

    CONSTRAINT "ChecklistTask_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_id_belongsToId_key" ON "public"."Asset"("id", "belongsToId");

-- AddForeignKey
ALTER TABLE "public"."Asset" ADD CONSTRAINT "Asset_belongsToId_fkey" FOREIGN KEY ("belongsToId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MaintenanceRecord" ADD CONSTRAINT "MaintenanceRecord_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "public"."Asset"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ChecklistTask" ADD CONSTRAINT "ChecklistTask_maintenanceRecordId_fkey" FOREIGN KEY ("maintenanceRecordId") REFERENCES "public"."MaintenanceRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
