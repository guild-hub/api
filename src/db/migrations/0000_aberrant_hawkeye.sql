CREATE TABLE IF NOT EXISTS "alliance" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seeker_id" bigint,
	"guild_id" bigint,
	"status" smallint NOT NULL,
	"here_mention" boolean DEFAULT false,
	"everyone_mention" boolean DEFAULT false,
	"accepted_at" timestamp,
	"denial_reason" varchar(255),
	"denied_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "blacklist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" bigint NOT NULL,
	"user_id" bigint NOT NULL,
	"type" smallint NOT NULL,
	"reason" varchar(255),
	"expiration_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "blacklist_guild_id_unique" UNIQUE("guild_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "embed_field" (
	"id" varchar(8) PRIMARY KEY NOT NULL,
	"embed_id" uuid,
	"name" varchar(256) NOT NULL,
	"value" varchar(1024) NOT NULL,
	"inline" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "embed" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid,
	"is_active" boolean DEFAULT false,
	"name" varchar(25) NOT NULL,
	"author_name" varchar(256),
	"author_icon_url" varchar(2048),
	"title" varchar(256),
	"description" varchar(4096),
	"hex_color" varchar(7),
	"image_url" varchar(2048),
	"thumbnail_url" varchar(2048),
	"footer_text" varchar(2048),
	"footer_icon_url" varchar(2048),
	"footer_timestamp" boolean,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "embed_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_blacklist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" bigint,
	"user_id" bigint NOT NULL,
	"blacklisted_guild_id" bigint NOT NULL,
	"type" smallint NOT NULL,
	"reason" varchar(255),
	"expiration_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guild_blacklist_blacklisted_guild_id_unique" UNIQUE("blacklisted_guild_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild_seekers" (
	"seeker_id" bigint,
	"guild_id" bigint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "guild_seekers_seeker_id_guild_id_pk" PRIMARY KEY("seeker_id","guild_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "guild" (
	"id" bigint PRIMARY KEY NOT NULL,
	"alliances_channel_id" bigint,
	"subscription_plan" smallint DEFAULT 0,
	"subscription_start_date" timestamp DEFAULT now(),
	"subscription_end_date" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "partnership" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seeker_id" bigint,
	"guild_id" bigint,
	"status" smallint NOT NULL,
	"here_mention" boolean DEFAULT false,
	"everyone_mention" boolean DEFAULT false,
	"end_date" timestamp,
	"accepted_at" timestamp,
	"denial_reason" varchar(255),
	"denied_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "requirement" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" bigint,
	"verified" boolean,
	"partnered" boolean,
	"minimum_age" smallint,
	"minimum_boosts" smallint,
	"minimum_members" integer,
	"creation_date" timestamp,
	"mfa_level" smallint,
	"nsfw_content_level" smallint,
	"verification_level" smallint,
	"locales" varchar(8)[],
	"excluded_locales" varchar(8)[],
	"explicit_content_level" smallint,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "seeker" (
	"id" bigint PRIMARY KEY NOT NULL,
	"verified" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "template" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"guild_id" bigint,
	"name" varchar(25) NOT NULL,
	"role_mentions_ids" bigint[],
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "template_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "alliances_seeker_idx" ON "alliance" ("seeker_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alliances_guild_idx" ON "alliance" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "alliances_status_idx" ON "alliance" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blacklist_guild_idx" ON "blacklist" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blacklist_user_idx" ON "blacklist" ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "embed_idx" ON "embed_field" ("embed_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "template_id_name_idx" ON "embed" ("template_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "is_active_idx" ON "embed" ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guild_blacklist_guild_idx" ON "guild_blacklist" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "guild_blacklist_user_idx" ON "guild_blacklist" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "blacklisted_guild_idx" ON "guild_blacklist" ("blacklisted_guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "subscription_plan_idx" ON "guild" ("subscription_plan");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "partnerships_seeker_idx" ON "partnership" ("seeker_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "partnerships_guild_idx" ON "partnership" ("guild_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "partnerships_status_idx" ON "partnership" ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "requirements_guild_idx" ON "requirement" ("guild_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "guild_id_name_idx" ON "template" ("guild_id","name");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alliance" ADD CONSTRAINT "alliance_seeker_id_seeker_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "seeker"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "alliance" ADD CONSTRAINT "alliance_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embed_field" ADD CONSTRAINT "embed_field_embed_id_embed_id_fk" FOREIGN KEY ("embed_id") REFERENCES "embed"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "embed" ADD CONSTRAINT "embed_template_id_template_id_fk" FOREIGN KEY ("template_id") REFERENCES "template"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guild_blacklist" ADD CONSTRAINT "guild_blacklist_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guild_seekers" ADD CONSTRAINT "guild_seekers_seeker_id_seeker_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "seeker"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "guild_seekers" ADD CONSTRAINT "guild_seekers_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partnership" ADD CONSTRAINT "partnership_seeker_id_seeker_id_fk" FOREIGN KEY ("seeker_id") REFERENCES "seeker"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "partnership" ADD CONSTRAINT "partnership_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "requirement" ADD CONSTRAINT "requirement_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "template" ADD CONSTRAINT "template_guild_id_guild_id_fk" FOREIGN KEY ("guild_id") REFERENCES "guild"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
