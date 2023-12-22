-- CreateTable
CREATE TABLE "person_enrichment" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "full_name" TEXT,
    "email" TEXT NOT NULL,
    "linkedin_url" TEXT,
    "email_verified" BOOLEAN,
    "contact_number" TEXT,
    "job_title" TEXT,
    "seniority" TEXT,
    "current_company" TEXT,
    "current_company_domain" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "person_enrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "person_for_fingerprint" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "person_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "person_for_fingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "person_enrichment_email_key" ON "person_enrichment"("email");

-- AddForeignKey
ALTER TABLE "person_for_fingerprint" ADD CONSTRAINT "person_for_fingerprint_person_id_fkey" FOREIGN KEY ("person_id") REFERENCES "person_enrichment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
