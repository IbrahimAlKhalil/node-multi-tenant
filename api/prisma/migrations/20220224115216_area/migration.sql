CREATE TABLE "Area"
(
    id      serial NOT NULL,
    "order" int,
    CONSTRAINT "Area_pkey" PRIMARY KEY (id)
);

CREATE TABLE "Building"
(
    id       serial NOT NULL,
    "areaId" int,
    "order"  int,
    CONSTRAINT "Building_pkey" PRIMARY KEY (id),
    CONSTRAINT "Building_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Floor"
(
    id           serial NOT NULL,
    "buildingId" int,
    "order"      int,
    CONSTRAINT "Floor_pkey" PRIMARY KEY (id),
    CONSTRAINT "Floor_buildingId_fkey" FOREIGN KEY ("buildingId") REFERENCES "Building" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Room"
(
    id        serial NOT NULL,
    "floorId" int,
    "order"   int,
    CONSTRAINT "Room_pkey" PRIMARY KEY (id),
    CONSTRAINT "Room_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "AreaI18n"
(
    "areaId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "AreaI18n_pkey" PRIMARY KEY ("areaId", "languageId"),
    CONSTRAINT "AreaI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AreaI18n_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "BuildingI18n"
(
    "buildingId" int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "BuildingI18n_pkey" PRIMARY KEY ("buildingId", "languageId")
);

CREATE TABLE "FloorI18n"
(
    "floorId"    int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "FloorI18n_pkey" PRIMARY KEY ("floorId", "languageId"),
    CONSTRAINT "FloorI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FloorI18n_floorId_fkey" FOREIGN KEY ("floorId") REFERENCES "Floor" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "RoomI18n"
(
    "roomId"     int          NOT NULL,
    "languageId" int          NOT NULL,
    name         varchar(100) NOT NULL,
    CONSTRAINT "RoomI18n_pkey" PRIMARY KEY ("roomId", "languageId"),
    CONSTRAINT "RoomI18n_languageId_fkey" FOREIGN KEY ("languageId") REFERENCES "Language" (id) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "RoomI18n_roomId_fkey" FOREIGN KEY ("roomId") REFERENCES "Room" (id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE UNIQUE INDEX "Area_order_key" ON "Area" ("order");

CREATE UNIQUE INDEX "Building_areaId_order_key" ON "Building" ("areaId", "order");

CREATE UNIQUE INDEX "Floor_buildingId_order_key" ON "Floor" ("buildingId", "order");

CREATE UNIQUE INDEX "Room_floorId_order_key" ON "Room" ("floorId", "order");