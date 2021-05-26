DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE IF EXISTS foodfy;
CREATE DATABASE foodfy;

CREATE TABLE "recipes" (
    "id" SERIAL PRIMARY KEY,
    "title" text NOT NULL,
    "ingredients" text[] NOT NULL,
    "preparation" text[] NOT NULL,
    "information" text,
    "created_at" timestamp DEFAULT (now()),
    "chef_id" int NOT NULL,
    "updated_at" timestamp DEFAULT (now()),
    "user_id" int
);

CREATE TABLE "chefs" (
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "created_at" timestamp DEFAULT (now()),
    "file_id" int
);

CREATE TABLE "files" (
  "id" SERIAL PRIMARY KEY,
  "name" text,
  "path" text NOT NULL
);

CREATE TABLE "recipe_files" (
  "id" SERIAL PRIMARY KEY,
  "recipe_id" int,
  "file_id" int
);

CREATE TABLE "users"(
    "id" SERIAL PRIMARY KEY,
    "name" text NOT NULL,
    "email" text UNIQUE NOT NULL,
    "password" text NOT NULL,
    "reset_token" text,
    "reset_token_expires" text,
  	"is_admin" boolean,
  	"created_at" timestamp DEFAULT (now()),   
  	"updated_at" timestamp DEFAULT (now())
);

--create procedure

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql; 

-- auto updated_at products

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON recipes
FOR EACH ROW 
EXECUTE PROCEDURE trigger_set_timestamp();

-- auto updated_at users

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW 
EXECUTE PROCEDURE trigger_set_timestamp();

-- connect pg simple table

CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");

-- FK

ALTER TABLE "recipes" ADD FOREIGN KEY ("user_id") REFERENCES users("id") ON DELETE CASCADE
ALTER TABLE "recipes" ADD FOREIGN KEY ("chef_id") REFERENCES chefs("id") ON DELETE CASCADE

ALTER TABLE "recipe_files" ADD FOREIGN KEY ("recipe_id") REFERENCES recipes("id") ON DELETE CASCADE
ALTER TABLE "recipe_files" ADD FOREIGN KEY ("file_id") REFERENCES files("id") ON DELETE CASCADE


-- to run seeds

DELETE FROM recipes;
DELETE FROM chefs;
DELETE FROM users;
DELETE FROM files;
DELETE FROM recipe_files;

-- restart sequence auto_increment from tables id

ALTER SEQUENCE users_id_seq RESTART WITH 1;
ALTER SEQUENCE files_id_seq RESTART WITH 1;
ALTER SEQUENCE recipes_id_seq RESTART WITH 1;
ALTER SEQUENCE chefs_id_seq RESTART WITH 1;
ALTER SEQUENCE recipe_files_id_seq RESTART WITH 1;