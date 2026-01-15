/*
  Warnings:

  - You are about to drop the column `belongsToId` on the `Product` table. All the data in the column will be lost.
  - Added the required column `belongsToid` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Product" DROP CONSTRAINT "Product_belongsToId_fkey";

-- AlterTable
ALTER TABLE "public"."Product" DROP COLUMN "belongsToId",
ADD COLUMN     "belongsToid" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Product" ADD CONSTRAINT "Product_belongsToid_fkey" FOREIGN KEY ("belongsToid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
