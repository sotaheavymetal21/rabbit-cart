-- Create "products" table
CREATE TABLE "products" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "name" text NOT NULL,
  "description" text NOT NULL,
  "price" bigint NOT NULL,
  "stock" bigint NOT NULL,
  "image_url" text NOT NULL,
  "category" text NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id")
);

-- Create "users" table
CREATE TABLE "users" (
  "id" uuid NOT NULL DEFAULT gen_random_uuid(),
  "email" text NOT NULL,
  "password_hash" text NOT NULL,
  "created_at" timestamptz NULL,
  "updated_at" timestamptz NULL,
  PRIMARY KEY ("id"),
  CONSTRAINT "uni_users_email" UNIQUE ("email")
);
