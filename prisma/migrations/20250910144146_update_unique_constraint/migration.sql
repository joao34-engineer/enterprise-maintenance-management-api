/*
  Warnings:

  - A unique constraint covering the columns `[id,belongsToid]` on the table `Product` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Product_id_belongsToid_key" ON "public"."Product"("id", "belongsToid");
