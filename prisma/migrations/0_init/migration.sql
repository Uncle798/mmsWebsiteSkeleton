-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('STRIPE', 'CASH', 'CHECK');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "email" TEXT,
    "givenName" TEXT,
    "familyName" TEXT,
    "organizationName" TEXT,
    "email_verified" BOOLEAN,
    "password_hash" TEXT,
    "employee" BOOLEAN NOT NULL DEFAULT false,
    "admin" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactInfo" (
    "contactId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "address3" TEXT,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip" TEXT NOT NULL,
    "phoneNum1" TEXT NOT NULL,
    "phoneNum2" TEXT,
    "phoneNum1Validated" BOOLEAN NOT NULL DEFAULT false,
    "phoneNum2Validated" BOOLEAN DEFAULT false,
    "softDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ContactInfo_pkey" PRIMARY KEY ("contactId")
);

-- CreateTable
CREATE TABLE "Unit" (
    "num" TEXT NOT NULL,
    "building" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Unit_pkey" PRIMARY KEY ("num")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "pricingId" TEXT NOT NULL,
    "size" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("pricingId")
);

-- CreateTable
CREATE TABLE "UnitPricing" (
    "unitPricingId" TEXT NOT NULL,
    "unitNum" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "stripeProductId" TEXT,

    CONSTRAINT "UnitPricing_pkey" PRIMARY KEY ("unitPricingId")
);

-- CreateTable
CREATE TABLE "Lease" (
    "leaseId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "contactInfoId" TEXT NOT NULL,
    "unitNum" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "leaseCreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leaseReturnedAt" TIMESTAMP(3),
    "leaseEffectiveDate" TIMESTAMP(3) NOT NULL,
    "leaseEnded" TIMESTAMP(3),
    "dropboxURL" TEXT,
    "anvilEID" TEXT,

    CONSTRAINT "Lease_pkey" PRIMARY KEY ("leaseId")
);

-- CreateTable
CREATE TABLE "PaymentRecord" (
    "paymentId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "unitNum" TEXT,
    "unitPrice" INTEGER,
    "amount" INTEGER NOT NULL,
    "receiverId" TEXT NOT NULL,
    "payee" TEXT,
    "paymentCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentCompleted" TIMESTAMP(3),
    "paymentType" "PaymentType" NOT NULL,
    "recordNum" TEXT NOT NULL,
    "invoiceNum" TEXT,

    CONSTRAINT "PaymentRecord_pkey" PRIMARY KEY ("paymentId")
);

-- CreateTable
CREATE TABLE "Invoice" (
    "invoiceId" TEXT NOT NULL,
    "customerId" TEXT,
    "leaseId" TEXT,
    "unitNum" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "invoiceCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "paymentRecordId" TEXT,
    "invoicePaid" TIMESTAMP(3),

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("invoiceId")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Verification" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Verification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordReset" (
    "token_hash" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_id_email_idx" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_id_email_key" ON "users"("id", "email");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_givenName_familyName_key" ON "users"("email", "givenName", "familyName");

-- CreateIndex
CREATE INDEX "Unit_num_idx" ON "Unit"("num" DESC);

-- CreateIndex
CREATE INDEX "Pricing_size_endDate_idx" ON "Pricing"("size", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_price_startDate_endDate_key" ON "Pricing"("price", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "Pricing_size_startDate_endDate_key" ON "Pricing"("size", "startDate", "endDate");

-- CreateIndex
CREATE UNIQUE INDEX "UnitPricing_unitNum_price_key" ON "UnitPricing"("unitNum", "price");

-- CreateIndex
CREATE UNIQUE INDEX "UnitPricing_unitNum_startDate_endDate_key" ON "UnitPricing"("unitNum", "startDate", "endDate");

-- CreateIndex
CREATE INDEX "Lease_leaseId_leaseCreatedAt_idx" ON "Lease"("leaseId", "leaseCreatedAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Lease_leaseId_unitNum_price_key" ON "Lease"("leaseId", "unitNum", "price");

-- CreateIndex
CREATE INDEX "PaymentRecord_paymentId_paymentCompleted_idx" ON "PaymentRecord"("paymentId", "paymentCompleted" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentRecord_paymentCompleted_paymentId_key" ON "PaymentRecord"("paymentCompleted", "paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentRecordId_key" ON "Invoice"("paymentRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_invoicePaid_key" ON "Invoice"("invoicePaid");

-- CreateIndex
CREATE INDEX "Invoice_invoiceId_invoiceCreated_idx" ON "Invoice"("invoiceId", "invoiceCreated" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_paymentRecordId_invoicePaid_key" ON "Invoice"("paymentRecordId", "invoicePaid");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordReset_token_hash_key" ON "PasswordReset"("token_hash");

-- AddForeignKey
ALTER TABLE "ContactInfo" ADD CONSTRAINT "ContactInfo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "UnitPricing" ADD CONSTRAINT "UnitPricing_price_startDate_endDate_fkey" FOREIGN KEY ("price", "startDate", "endDate") REFERENCES "Pricing"("price", "startDate", "endDate") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnitPricing" ADD CONSTRAINT "UnitPricing_unitNum_fkey" FOREIGN KEY ("unitNum") REFERENCES "Unit"("num") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_contactInfoId_fkey" FOREIGN KEY ("contactInfoId") REFERENCES "ContactInfo"("contactId") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Lease" ADD CONSTRAINT "Lease_price_unitNum_fkey" FOREIGN KEY ("price", "unitNum") REFERENCES "UnitPricing"("price", "unitNum") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentRecord" ADD CONSTRAINT "PaymentRecord_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_leaseId_unitNum_price_fkey" FOREIGN KEY ("leaseId", "unitNum", "price") REFERENCES "Lease"("leaseId", "unitNum", "price") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paymentRecordId_invoicePaid_fkey" FOREIGN KEY ("paymentRecordId", "invoicePaid") REFERENCES "PaymentRecord"("paymentId", "paymentCompleted") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_user_id_email_fkey" FOREIGN KEY ("user_id", "email") REFERENCES "users"("id", "email") ON DELETE RESTRICT ON UPDATE CASCADE;

