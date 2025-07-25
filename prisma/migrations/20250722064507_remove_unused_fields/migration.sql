/*
  Warnings:

  - You are about to drop the `MangaImage` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PageImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "MangaImage" DROP CONSTRAINT "MangaImage_mangaId_fkey";

-- DropForeignKey
ALTER TABLE "PageImage" DROP CONSTRAINT "PageImage_episodeId_fkey";

-- DropTable
DROP TABLE "MangaImage";

-- DropTable
DROP TABLE "PageImage";
