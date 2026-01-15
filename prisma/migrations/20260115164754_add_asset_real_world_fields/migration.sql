-- AlterTable
ALTER TABLE "public"."Asset" ADD COLUMN     "assignedTo" VARCHAR(100),
ADD COLUMN     "description" TEXT,
ADD COLUMN     "location" VARCHAR(255),
ADD COLUMN     "manufacturer" VARCHAR(100),
ADD COLUMN     "model" VARCHAR(100),
ADD COLUMN     "purchaseDate" TIMESTAMP(3),
ADD COLUMN     "serialNumber" VARCHAR(100),
ADD COLUMN     "status" VARCHAR(50),
ADD COLUMN     "type" VARCHAR(100),
ADD COLUMN     "value" DOUBLE PRECISION,
ADD COLUMN     "warrantyExpiration" TIMESTAMP(3);
