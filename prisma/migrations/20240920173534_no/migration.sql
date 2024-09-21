/*
  Warnings:

  - You are about to drop the `Pricing` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UnitPricing` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `price` to the `Unit` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Lease" DROP CONSTRAINT "Lease_price_unitNum_fkey";

-- DropForeignKey
ALTER TABLE "UnitPricing" DROP CONSTRAINT "UnitPricing_price_startDate_endDate_fkey";

-- DropForeignKey
ALTER TABLE "UnitPricing" DROP CONSTRAINT "UnitPricing_unitNum_fkey";

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "invoiceNotes" TEXT;

-- AlterTable
ALTER TABLE "Unit" ADD COLUMN     "price" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Pricing";

-- DropTable
DROP TABLE "UnitPricing";

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_unitNum_fkey" FOREIGN KEY ("unitNum") REFERENCES "Unit"("num") ON DELETE RESTRICT ON UPDATE CASCADE;
