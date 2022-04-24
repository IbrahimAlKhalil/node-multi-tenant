CREATE TABLE "AccessToken"
(
    id          serial         NOT NULL,
    "userId"    int            NOT NULL,
    "ipAddress" text           NOT NULL,
    "userAgent" text,
    "expiresAt" timestamptz(6) NOT NULL,
    "createdAt" timestamptz(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    CONSTRAINT "AccessToken_pkey" PRIMARY KEY (id),
    CONSTRAINT "AccessToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "AccessToken_userId_idx" ON "AccessToken" ("userId");