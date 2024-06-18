-- CreateEnum
CREATE TYPE "UserRoles" AS ENUM ('recipient', 'adm', 'courier');

-- CreateEnum
CREATE TYPE "UpdateObjectTypes" AS ENUM ('recipient', 'adm', 'courier', 'order');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "recipient_d" TEXT NOT NULL,
    "courier_id" TEXT,
    "address" JSONB NOT NULL,
    "delivered" TIMESTAMP(3),
    "delivered_photo" JSONB,
    "awaiting_pickup" TIMESTAMP(3),
    "collected" TIMESTAMP(3),
    "returned" TIMESTAMP(3),
    "return_cause" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRoles" NOT NULL,
    "coordinates" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL,
    "updated_at" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "updates" (
    "id" TEXT NOT NULL,
    "object_id" TEXT NOT NULL,
    "updated_by" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "changes" JSONB NOT NULL,
    "object_type" "UpdateObjectTypes" NOT NULL,

    CONSTRAINT "updates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_cpf_key" ON "users"("cpf");

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_recipient_d_fkey" FOREIGN KEY ("recipient_d") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_courier_id_fkey" FOREIGN KEY ("courier_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "updates" ADD CONSTRAINT "updates_updated_by_fkey" FOREIGN KEY ("updated_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
