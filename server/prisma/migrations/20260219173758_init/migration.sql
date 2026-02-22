-- CreateTable
CREATE TABLE "UserConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "jiraDomain" TEXT NOT NULL,
    "apiToken" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "accountId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Task" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "summary" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "projectKey" TEXT NOT NULL,
    "priorityUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Worklog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "issueKey" TEXT NOT NULL,
    "startTime" DATETIME NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "comment" TEXT,
    "verificationStatus" TEXT NOT NULL,
    "jiraWorklogId" TEXT,
    CONSTRAINT "Worklog_issueKey_fkey" FOREIGN KEY ("issueKey") REFERENCES "Task" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
