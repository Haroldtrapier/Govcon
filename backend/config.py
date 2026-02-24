import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # AI / LLM Keys
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY = os.getenv("ANTHROPIC_API_KEY")
    OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o")
    ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-sonnet-4-20250514")

    # Government APIs
    SAM_GOV_API_KEY = os.getenv("SAM_GOV_API_KEY", "")
    GRANTS_GOV_API_KEY = os.getenv("GRANTS_GOV_API_KEY", "")

    # Supabase
    SUPABASE_URL = os.getenv("SUPABASE_URL", os.getenv("NEXT_PUBLIC_SUPABASE_URL", ""))
    SUPABASE_KEY = os.getenv("SUPABASE_KEY", os.getenv("SUPABASE_SERVICE_ROLE_KEY", ""))
    SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY", os.getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY", ""))
    SUPABASE_JWT_SECRET = os.getenv("SUPABASE_JWT_SECRET", "")

    # Database (SQLAlchemy - direct Postgres connection)
    DATABASE_URL = os.getenv("DATABASE_URL")

    # Stripe
    STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
    STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET", "")
    STRIPE_PRICE_PRO_MONTHLY = os.getenv("STRIPE_PRICE_PRO_MONTHLY", "")
    STRIPE_PRICE_PRO_ANNUAL = os.getenv("STRIPE_PRICE_PRO_ANNUAL", "")
    STRIPE_PRICE_ENTERPRISE_MONTHLY = os.getenv("STRIPE_PRICE_ENTERPRISE_MONTHLY", "")

    # Redis (for background jobs)
    REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")

    # Email
    RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
    FROM_EMAIL = os.getenv("FROM_EMAIL", "info@trapiermanagement.com")

    # Rate Limiting
    RATE_LIMIT_REQUESTS = int(os.getenv("RATE_LIMIT_REQUESTS", "100"))
    RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", "60"))

    # Logging
    LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO")

    # Environment
    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    DEBUG = ENVIRONMENT == "development"

    # CORS
    FRONTEND_URL = os.getenv("FRONTEND_URL", os.getenv("NEXT_PUBLIC_APP_URL", "http://localhost:3000"))
    ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", FRONTEND_URL).split(",")

    # Server
    PORT = int(os.getenv("PORT", "8000"))
    HOST = os.getenv("HOST", "0.0.0.0")

config = Config()
