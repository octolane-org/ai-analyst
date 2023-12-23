-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "provider_account_id" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "oauth_token_secret" TEXT,
    "oauth_token" TEXT,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "session_token" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "fingerprint" TEXT,
    "ip" TEXT,
    "user_agent" TEXT,
    "enrichment_limit" INTEGER DEFAULT 500,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "verification_token" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "verification_token_pkey" PRIMARY KEY ("id")
);

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
    "estimated_total_fund_raised" INTEGER,
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
CREATE UNIQUE INDEX "account_provider_provider_account_id_key" ON "account"("provider", "provider_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "session_session_token_key" ON "session"("session_token");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_token_key" ON "verification_token"("token");

-- CreateIndex
CREATE UNIQUE INDEX "verification_token_identifier_token_key" ON "verification_token"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "company_enrichment_domain_key" ON "company_enrichment"("domain");

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_for_fingerprint" ADD CONSTRAINT "company_for_fingerprint_company_id_fkey" FOREIGN KEY ("company_id") REFERENCES "company_enrichment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
