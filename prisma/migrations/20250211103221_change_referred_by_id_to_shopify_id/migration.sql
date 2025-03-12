-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Customer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopifyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "referralBalance" REAL NOT NULL DEFAULT 0.0,
    "referralCount" INTEGER NOT NULL DEFAULT 0,
    "payoutStatus" TEXT NOT NULL DEFAULT 'none',
    "referredById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Customer_referredById_fkey" FOREIGN KEY ("referredById") REFERENCES "Customer" ("shopifyId") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Customer" ("createdAt", "email", "id", "name", "payoutStatus", "referralBalance", "referralCode", "referralCount", "referredById", "shopifyId") SELECT "createdAt", "email", "id", "name", "payoutStatus", "referralBalance", "referralCode", "referralCount", "referredById", "shopifyId" FROM "Customer";
DROP TABLE "Customer";
ALTER TABLE "new_Customer" RENAME TO "Customer";
CREATE UNIQUE INDEX "Customer_shopifyId_key" ON "Customer"("shopifyId");
CREATE UNIQUE INDEX "Customer_email_key" ON "Customer"("email");
CREATE UNIQUE INDEX "Customer_referralCode_key" ON "Customer"("referralCode");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
