-- AlterTable: Add new vendor fields
ALTER TABLE "vendors"
  ADD COLUMN "bio" TEXT,
  ADD COLUMN "per_person_cost" DECIMAL(10,2),
  ADD COLUMN "package_minimum" DECIMAL(10,2),
  ADD COLUMN "website_url" TEXT,
  ADD COLUMN "instagram_url" TEXT,
  ADD COLUMN "facebook_url" TEXT,
  ADD COLUMN "portfolio_url" TEXT;

-- Rename existing website column if it exists
ALTER TABLE "vendors"
  DROP COLUMN IF EXISTS "website";

-- Enable Realtime for dashboard_services table
ALTER TABLE "dashboard_services" REPLICA IDENTITY FULL;

-- Enable Realtime for client_dashboards table
ALTER TABLE "client_dashboards" REPLICA IDENTITY FULL;
