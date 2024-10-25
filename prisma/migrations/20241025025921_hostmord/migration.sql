-- CreateEnum
CREATE TYPE "Interval" AS ENUM ('MONTH_1', 'MONTH_3', 'MONTH_6', 'MONTH_12', 'MONTH_24');

-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ACTIVE', 'SUSPENDED', 'PENDING');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('MODERATOR', 'ADMIN');

-- CreateTable
CREATE TABLE "User" (
    "userid" TEXT NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "confirm_password" TEXT NOT NULL,
    "otp" TEXT,
    "otpExpiry" TIMESTAMP(3),
    "isActive" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "accountStatus" "Status" NOT NULL DEFAULT 'PENDING',
    "token" TEXT,
    "lastLogin" TIMESTAMP(3),
    "profilePicture" TEXT,
    "fingerprint" TEXT,
    "date_created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',

    CONSTRAINT "User_pkey" PRIMARY KEY ("userid")
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

-- CreateTable
CREATE TABLE "HostingPlan" (
    "id" TEXT NOT NULL,
    "planName" TEXT NOT NULL,

    CONSTRAINT "HostingPlan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pricing" (
    "id" TEXT NOT NULL,
    "interval" "Interval" NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "hostingPlanId" TEXT NOT NULL,

    CONSTRAINT "Pricing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

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
CREATE UNIQUE INDEX "GeoLocationRecord_userid_key" ON "GeoLocationRecord"("userid");

-- CreateIndex
CREATE UNIQUE INDEX "GeoLocationRecord_currencyid_key" ON "GeoLocationRecord"("currencyid");

-- CreateIndex
CREATE UNIQUE INDEX "GeoLocationRecord_timeZoneId_key" ON "GeoLocationRecord"("timeZoneId");

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("userid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_currencyid_fkey" FOREIGN KEY ("currencyid") REFERENCES "Currency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GeoLocationRecord" ADD CONSTRAINT "GeoLocationRecord_timeZoneId_fkey" FOREIGN KEY ("timeZoneId") REFERENCES "TimeZone"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pricing" ADD CONSTRAINT "Pricing_hostingPlanId_fkey" FOREIGN KEY ("hostingPlanId") REFERENCES "HostingPlan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
