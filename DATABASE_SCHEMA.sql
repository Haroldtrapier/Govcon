-- ============================================
-- GOVCON COMMAND CENTER - COMPLETE DATABASE SCHEMA
-- Multi-Product Platform with Modular Access
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & AUTHENTICATION
-- ============================================

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  phone TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- PRODUCTS & PRICING
-- ============================================

CREATE TYPE product_type AS ENUM ('tier', 'addon', 'bundle');

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  stripe_product_id TEXT UNIQUE NOT NULL,
  stripe_price_id TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  description TEXT,
  features JSONB,
  product_type product_type NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert all products
INSERT INTO products (name, slug, stripe_product_id, stripe_price_id, price_monthly, product_type, description, sort_order) VALUES
  ('Starter', 'starter', 'prod_TpXtv3lm3KWHLC', 'price_1SxJuWKMDblnt0kLhjwlx0Tm', 9700, 'tier', 'Solo contractors and small teams', 1),
  ('Professional', 'professional', 'prod_TpYYa7wutVAZQz', 'price_1SxJuVKMDblnt0kLMxf2eWy2', 19700, 'tier', 'Growing GovCon teams', 2),
  ('Enterprise', 'enterprise', 'prod_TpYlBRvRVnnC0U', 'price_1SxJuVKMDblnt0kLnSFRO22W', 39700, 'tier', 'Established prime contractors', 3),
  ('GovCon AI Pro', 'govcon-ai-pro', 'prod_Twarf4QTUbJraO', 'price_1SyhftKMDblnt0kLR9IZK6Bu', 49700, 'addon', 'AI-powered SAM.gov opportunity tracking', 4),
  ('FEMA Command Center', 'fema', 'prod_TwarL2lhkZHPIL', 'price_1SyhfsKMDblnt0kLYScvMRxT', 79700, 'addon', 'Disaster declarations and emergency grants', 5),
  ('Gov Ops Command Center', 'gov-ops', 'prod_TwarrjtH1ArYrr', 'price_1SyhfsKMDblnt0kLQbU1AHrT', 149700, 'addon', 'Mission tracking and vendor coordination', 6),
  ('Emergency Procurement Hub', 'procurement-hub', 'prod_TwarGWTnC2w4Vw', 'price_1SyhftKMDblnt0kLnVnxI9Iz', 299700, 'addon', 'Emergency procurement marketplace', 7);

-- ============================================
-- SUBSCRIPTIONS
-- ============================================

CREATE TYPE subscription_status AS ENUM ('active', 'canceled', 'past_due', 'trialing', 'incomplete');

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id TEXT NOT NULL,
  status subscription_status NOT NULL,
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT false,
  trial_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- See full schema in GitHub for all tables (opportunities, FEMA, Gov Ops, Procurement)

COMMENT ON DATABASE postgres IS 'GovCon Command Center - Multi-Product Platform';