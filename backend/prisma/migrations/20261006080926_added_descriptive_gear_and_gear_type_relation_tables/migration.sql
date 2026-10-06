-- CreateTable
CREATE TABLE "GearTypeRelation" (
    "id" SERIAL NOT NULL,
    "parent_gear_type_id" INTEGER NOT NULL,
    "child_gear_type_id" INTEGER NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "GearTypeRelation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DescriptiveGear" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "owner_id" INTEGER,
    "visibility" "Visibility" NOT NULL DEFAULT 'UNSPECIFIED',
    "status" "Status" NOT NULL DEFAULT 'ACTIVE',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by_id" INTEGER NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "updated_by_id" INTEGER NOT NULL,

    CONSTRAINT "DescriptiveGear_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DescriptiveGear_name_key" ON "DescriptiveGear"("name");

-- AddForeignKey
ALTER TABLE "GearTypeRelation" ADD CONSTRAINT "GearTypeRelation_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTypeRelation" ADD CONSTRAINT "GearTypeRelation_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTypeRelation" ADD CONSTRAINT "GearTypeRelation_parent_gear_type_id_fkey" FOREIGN KEY ("parent_gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GearTypeRelation" ADD CONSTRAINT "GearTypeRelation_child_gear_type_id_fkey" FOREIGN KEY ("child_gear_type_id") REFERENCES "GearType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveGear" ADD CONSTRAINT "DescriptiveGear_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveGear" ADD CONSTRAINT "DescriptiveGear_updated_by_id_fkey" FOREIGN KEY ("updated_by_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DescriptiveGear" ADD CONSTRAINT "DescriptiveGear_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
