-- CreateTable
CREATE TABLE "User" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "refresh_token" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "User_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Stats" (
    "userId" BIGINT NOT NULL PRIMARY KEY,
    "last_message_sent" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "last_online" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "message_points" REAL NOT NULL DEFAULT 10.0,
    "message_count_bucket" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "Message" (
    "messageId" BIGINT NOT NULL PRIMARY KEY,
    "userId" BIGINT NOT NULL,
    "createdAt" DATETIME NOT NULL,
    "statsUserId" BIGINT,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Stats" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Stats_userId_key" ON "Stats"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Message_messageId_key" ON "Message"("messageId");
