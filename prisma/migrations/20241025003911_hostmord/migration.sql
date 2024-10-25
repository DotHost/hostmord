-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'MODERATOR', 'AFFILIATE', 'DEVELOPER', 'MERCHANT', 'AGENT', 'ADMIN');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "Environment" AS ENUM ('LIVE', 'SANDBOX');

-- CreateTable
CREATE TABLE "User" (
    "userid" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" "Gender",
    "telephone" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirm_password" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "profilePicture" TEXT,
    "company_name" TEXT,
    "address" TEXT,
    "city" TEXT,
    "state" TEXT,
    "zip" TEXT,
    "default_currency" TEXT DEFAULT 'USD',
    "country" TEXT,
    "referall" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" "Status" NOT NULL DEFAULT 'ACTIVE',
    "token" TEXT,
    "lastLogin" TIMESTAMP(3),
    "fingerprint" TEXT,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
);

-- CreateTable
CREATE TABLE "ConnectResllerData" (
    "clientId" INTEGER NOT NULL,
    "resellerId" INTEGER NOT NULL,
    "brandId" INTEGER NOT NULL,
    "caccountStatus" INTEGER NOT NULL,
    "roleTypeId" INTEGER NOT NULL,
    "emailAddress" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ConnectResllerData_pkey" PRIMARY KEY ("emailAddress")
);

-- CreateTable
CREATE TABLE "CustomDomainPricing" (
    "domainName" TEXT NOT NULL,
    "registerFee" DOUBLE PRECISION NOT NULL,
    "renewalFee" DOUBLE PRECISION NOT NULL,
    "transferFee" DOUBLE PRECISION NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CustomDomainPricing_pkey" PRIMARY KEY ("domainName")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "wallet_id" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "bankName" TEXT,
    "dva_id" INTEGER,
    "accountName" TEXT,
    "bankId" INTEGER,
    "currency" TEXT,
    "cust_code" TEXT,
    "cust_id" INTEGER,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("wallet_id")
);

-- CreateTable
CREATE TABLE "WalletBalance" (
    "balanceId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WalletBalance_pkey" PRIMARY KEY ("balanceId")
);

-- CreateTable
CREATE TABLE "Pin" (
    "pinid" TEXT NOT NULL,
    "pin" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date_updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pin_pkey" PRIMARY KEY ("pinid")
);

-- CreateTable
CREATE TABLE "ApiKey" (
    "id" SERIAL NOT NULL,
    "publicKey" TEXT,
    "secretKey" TEXT,
    "userid" TEXT NOT NULL,
    "environment" "Environment" NOT NULL DEFAULT 'SANDBOX',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApiKey_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeoLocationRecord" (
    "userid" TEXT NOT NULL,
    "geonameId" TEXT NOT NULL,
    "isp" TEXT NOT NULL,
    "connectionType" TEXT,
    "organization" TEXT NOT NULL,
    "countryEmoji" TEXT NOT NULL,
    "currencyid" TEXT NOT NULL,
    "timeZoneId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Currency" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,

    CONSTRAINT "Currency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeZone" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "offset" INTEGER NOT NULL,
    "offsetWithDst" INTEGER NOT NULL,
    "currentTime" TIMESTAMP(3) NOT NULL,
    "currentTimeUnix" DOUBLE PRECISION NOT NULL,
    "isDst" BOOLEAN NOT NULL,
    "dstSavings" INTEGER NOT NULL,
    "dstExists" BOOLEAN NOT NULL,
    "dstStart" TEXT,
    "dstEnd" TEXT,

    CONSTRAINT "TimeZone_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_telephone_key" ON "User"("telephone");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_token_key" ON "User"("token");

-- CreateIndex
CREATE UNIQUE INDEX "User_fingerprint_key" ON "User"("fingerprint");

-- CreateIndex
CREATE INDEX "User_lastname_firstname_idx" ON "User"("lastname", "firstname");

-- CreateIndex
CREATE INDEX "User_isActive_isVerified_idx" ON "User"("isActive", "isVerified");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectResllerData_clientId_key" ON "ConnectResllerData"("clientId");

-- CreateIndex
CREATE UNIQUE INDEX "ConnectResllerData_emailAddress_key" ON "ConnectResllerData"("emailAddress");

-- CreateIndex
CREATE UNIQUE INDEX "CustomDomainPricing_domainName_key" ON "CustomDomainPricing"("domainName");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_accountNumber_key" ON "Wallet"("accountNumber");

-- CreateIndex
CREATE INDEX "Wallet_userId_idx" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "WalletBalance_userId_key" ON "WalletBalance"("userId");

-- CreateIndex
CREATE INDEX "WalletBalance_userId_idx" ON "WalletBalance"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Pin_userId_key" ON "Pin"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_publicKey_key" ON "ApiKey"("publicKey");

-- CreateIndex
CREATE UNIQUE INDEX "ApiKey_secretKey_key" ON "ApiKey"("secretKey");

-- CreateIndex
CREATE UNIQUE INDEX "GeoLocationRecord_userid_key" ON "GeoLocationRecord"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "GeoLocationRecord_currencyid_key" ON "GeoLocationRecord"("currencyid");

-- CreateIndex
CREATE UNIQUE INDEX "GeoLocationRecord_timeZoneId_key" ON "GeoLocationRecord"("timeZoneId");

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletBalance" ADD CONSTRAINT "WalletBalance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pin" ADD CONSTRAINT "Pin_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiKey" ADD CONSTRAINT "ApiKey_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_currencyid_fkey" FOREIGN KEY ("currencyid") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_timeZoneId_fkey" FOREIGN KEY ("timeZoneId") REFERENCES "TimeZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;
