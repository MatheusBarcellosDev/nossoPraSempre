-- CreateTable
CREATE TABLE "pages" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "nome1" TEXT NOT NULL,
    "nome2" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "mensagem" TEXT NOT NULL,
    "template" TEXT NOT NULL DEFAULT 'romantico',
    "musica" TEXT,
    "isPago" BOOLEAN NOT NULL DEFAULT false,
    "plano" TEXT NOT NULL DEFAULT 'basic',
    "slug" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "photos" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "url" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    CONSTRAINT "photos_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "pages" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "pages_slug_key" ON "pages"("slug");
