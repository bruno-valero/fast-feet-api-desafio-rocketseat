-- CreateTable
CREATE TABLE "PrismaNotification" (
    "recipient_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "readAt" TIMESTAMP(3),

    CONSTRAINT "PrismaNotification_pkey" PRIMARY KEY ("recipient_id")
);

-- AddForeignKey
ALTER TABLE "PrismaNotification" ADD CONSTRAINT "PrismaNotification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
