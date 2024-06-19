/*
  Warnings:

  - You are about to drop the `PrismaAttachments` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[delivered_photo]` on the table `orders` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "PrismaAttachments" DROP CONSTRAINT "PrismaAttachments_orderId_fkey";

-- DropTable
DROP TABLE "PrismaAttachments";

-- CreateTable
CREATE TABLE "PrismaAttachment" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "PrismaAttachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrismaAttachment_orderId_key" ON "PrismaAttachment"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "orders_delivered_photo_key" ON "orders"("delivered_photo");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_delivered_photo_fkey" FOREIGN KEY ("delivered_photo") REFERENCES "PrismaAttachment"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;
