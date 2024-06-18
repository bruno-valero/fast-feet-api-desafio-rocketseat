-- CreateTable
CREATE TABLE "PrismaAttachments" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "orderId" TEXT,

    CONSTRAINT "PrismaAttachments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PrismaAttachments" ADD CONSTRAINT "PrismaAttachments_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
