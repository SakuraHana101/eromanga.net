-- CreateTable
CREATE TABLE "MangaImage" (
    "id" UUID NOT NULL,
    "url" TEXT NOT NULL,
    "mangaId" UUID NOT NULL,

    CONSTRAINT "MangaImage_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MangaImage" ADD CONSTRAINT "MangaImage_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
