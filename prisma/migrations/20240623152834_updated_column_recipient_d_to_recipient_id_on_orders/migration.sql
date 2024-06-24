/*
  Warnings:

  - You are about to drop the column `recipient_d` on the `orders` table. All the data in the column will be lost.
  - Added the required column `recipient_id` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "orders" DROP CONSTRAINT "orders_recipient_d_fkey";

-- AlterTable
ALTER TABLE "orders" DROP COLUMN "recipient_d",
ADD COLUMN     "recipient_id" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
