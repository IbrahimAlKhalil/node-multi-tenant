CREATE TABLE "Conversation"
(
    id           serial       NOT NULL,
    name         varchar(100) NOT NULL,
    description  varchar(600) NOT NULL,
    "inviteOnly" boolean      NOT NULL DEFAULT (TRUE),
    CONSTRAINT "Conversation_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Chat"
(
    id               serial         NOT NULL,
    "conversationId" int            NOT NULL,
    "userId"         int            NOT NULL,
    "parentId"       int            NOT NULL,
    message          varchar(6000)  NOT NULL,
    "createdAt"      timestamptz(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "deletedAt"      timestamptz(6),
    CONSTRAINT "Chat_pkey" PRIMARY KEY (id),
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chat_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Chat" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chat_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ChatFile"
(
    "chatId" int  NOT NULL,
    "fileId" uuid NOT NULL,
    CONSTRAINT "ChatFile_pkey" PRIMARY KEY ("chatId", "fileId"),
    CONSTRAINT "ChatFile_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "File" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatFile_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "ConversationMember"
(
    "conversationId" int            NOT NULL,
    "userId"         int            NOT NULL,
    "lastRead"       timestamptz(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    "lastSeen"       timestamptz(6) NOT NULL DEFAULT (CURRENT_TIMESTAMP),
    CONSTRAINT "ConversationMember_pkey" PRIMARY KEY ("conversationId", "userId"),
    CONSTRAINT "ConversationMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ConversationMember_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX "Chat_conversationId_idx" ON "Chat" ("conversationId");

CREATE INDEX "Chat_parentId_idx" ON "Chat" ("parentId");

CREATE INDEX "Chat_userId_idx" ON "Chat" ("userId");