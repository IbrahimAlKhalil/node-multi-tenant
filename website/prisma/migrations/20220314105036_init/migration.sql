CREATE TABLE "Cluster"
(
    id          uuid NOT NULL,
    name        text NOT NULL,
    description text,
    host        text NOT NULL,
    CONSTRAINT "Cluster_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Institute"
(
    id          uuid NOT NULL,
    "clusterId" uuid NOT NULL,
    code        text NOT NULL,
    name        text NOT NULL,
    slug        text NOT NULL,
    "database"  text NOT NULL,
    "email"     text NOT NULL,
    "mobile"    text NOT NULL,
    "disabled"  boolean NOT NULL DEFAULT false,
    CONSTRAINT "Institute_pkey" PRIMARY KEY (id),
    CONSTRAINT "Institute_clusterId_fkey" FOREIGN KEY ("clusterId") REFERENCES "Cluster" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Cluster_host_key" ON "Cluster" ("host");

CREATE INDEX "Cluster_host_idx" ON "Cluster" ("host");

CREATE UNIQUE INDEX "Institute_slug_key" ON "Institute" ("slug");

CREATE UNIQUE INDEX "Institute_code_key" ON "Institute" ("code");

CREATE INDEX "Institute_clusterId_idx" ON "Institute" ("clusterId");

CREATE INDEX "Institute_email_idx" ON "Institute" ("email");

CREATE INDEX "Institute_mobile_idx" ON "Institute" ("mobile");