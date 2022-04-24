CREATE TABLE "Preset"
(
    id      int          NOT NULL,
    "table" varchar(100) NOT NULL,
    value   jsonb        NOT NULL,
    CONSTRAINT "Preset_pkey" PRIMARY KEY (id, "table"),
    CONSTRAINT "Preset_id_fkey" FOREIGN KEY (id) REFERENCES "User" (id) ON DELETE CASCADE ON UPDATE CASCADE
);