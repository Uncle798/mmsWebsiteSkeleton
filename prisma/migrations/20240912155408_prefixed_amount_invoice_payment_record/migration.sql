/*
  Warnings:

  - You are about to drop the column `amount` on the `Invoice` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `PaymentRecord` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNum` on the `PaymentRecord` table. All the data in the column will be lost.
  - Added the required column `invoiceAmount` to the `Invoice` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentAmount` to the `PaymentRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "amount",
ADD COLUMN     "invoiceAmount" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "PaymentRecord" DROP COLUMN "amount",
DROP COLUMN "invoiceNum",
ADD COLUMN     "invoiceId" TEXT,
ADD COLUMN     "paymentAmount" INTEGER NOT NULL;
