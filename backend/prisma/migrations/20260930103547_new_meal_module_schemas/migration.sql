-- CreateTable
CREATE TABLE "MealPack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "derived_from_meal_pack_id" INTEGER,
    "consumption_frequency" "Frequency" NOT NULL,
    "qty_per_consumption" INTEGER NOT NULL,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'PRIVATE',
    "is_universal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "MealPack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL,
    "is_universal" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,
    "verified_at" TIMESTAMP(3),
    "verified_by_id" INTEGER,

    CONSTRAINT "MealItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MealPackItem" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "meal_pack_id" INTEGER NOT NULL,
    "meal_pack_nickname" TEXT,
    "meal_item_id" INTEGER NOT NULL,
    "meal_item_frequency" "Frequency",
    "meal_item_qty" INTEGER,
    "notes" TEXT,
    "status" "Status" NOT NULL DEFAULT 'UNSPECIFIED',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "MealPackItem_pkey" PRIMARY KEY ("id")
);
