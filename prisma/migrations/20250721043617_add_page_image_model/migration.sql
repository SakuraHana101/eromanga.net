-- CreateTable
CREATE TABLE "PageImage" (
    "id" UUID NOT NULL,
    "episodeId" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "PageImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "PageImage" ADD CONSTRAINT "PageImage_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE CASCADE ON UPDATE CASCADE;
