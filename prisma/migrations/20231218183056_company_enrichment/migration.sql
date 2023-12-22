-- AlterTable
ALTER TABLE "person_for_fingerprint" ADD COLUMN     "companyEnrichmentId" INTEGER;

-- CreateTable
CREATE TABLE "company_enrichment" (
    "id" SERIAL NOT NULL,
    "domain" TEXT NOT NULL,
    "company_name" TEXT,
    "industry" TEXT,
    "founded_at" INTEGER,
    "linkedin_url" TEXT,
    "primary_location" TEXT,
    "twitter_url" TEXT,
    "twitter_followers" TEXT,
    "estimated_annual_revenue" TEXT,
    "employee_size_range" TEXT,
    "tags" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_enrichment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_for_fingerprint" (
    "id" SERIAL NOT NULL,
    "fingerprint" TEXT NOT NULL,
    "company_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_for_fingerprint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_enrichment_domain_key" ON "company_enrichment"("domain");

-- AddForeignKey
ALTER TABLE "company_for_fingerprint" ADD CONSTRAINT "company_for_fingerprint_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_enrichment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
