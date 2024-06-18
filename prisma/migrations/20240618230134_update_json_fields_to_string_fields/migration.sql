-- AlterTable
ALTER TABLE "orders" ALTER COLUMN "address" SET DATA TYPE TEXT,
ALTER COLUMN "delivered_photo" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "updates" ALTER COLUMN "changes" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "coordinates" SET DATA TYPE TEXT;
