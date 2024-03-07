CREATE TABLE `alliance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`sender_seeker_id` blob,
	`receiver_seeker_id` blob,
	`sender_guild_id` blob,
	`receiver_guild_id` blob,
	`status` integer,
	`accepted_at` integer,
	`rejected_at` integer,
	`rejected_reason` text(255),
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`sender_seeker_id`) REFERENCES `seekers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_seeker_id`) REFERENCES `seekers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `blacklist` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`guild_id` blob NOT NULL,
	`user_id` blob NOT NULL,
	`type` integer NOT NULL,
	`reason` text(255),
	`expiration_date` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `embed_field` (
	`id` text(8) PRIMARY KEY NOT NULL,
	`embed_id` text(36),
	`name` text(256) NOT NULL,
	`value` text(1024) NOT NULL,
	`inline` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`embed_id`) REFERENCES `embed`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `embed` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`guild_id` blob,
	`active` integer DEFAULT false,
	`name` text(25) NOT NULL,
	`author_name` text(256),
	`author_icon_url` text(2048),
	`title` text(256),
	`description` text(4096),
	`hex_color` text(7),
	`image_url` text(2048),
	`thumbnail_url` text(2048),
	`footer_text` text(2048),
	`footer_icon_url` text(2048),
	`footer_timestamp` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guild_blacklist` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`guild_id` blob,
	`user_id` blob NOT NULL,
	`blacklisted_guild_id` blob NOT NULL,
	`type` integer NOT NULL,
	`reason` text(255),
	`expiration_date` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guild_seekers` (
	`guild_id` blob,
	`user_id` blob,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `seekers`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `guild` (
	`id` blob PRIMARY KEY NOT NULL,
	`alliances_channel_id` blob,
	`partnerships_channel_id` blob,
	`subscription_plan` integer,
	`subscription_start_date` integer,
	`subscription_end_date` integer,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `partnership` (
	`id` text(8) PRIMARY KEY NOT NULL,
	`sender_seeker_id` blob,
	`receiver_seeker_id` blob,
	`sender_guild_id` blob,
	`receiver_guild_id` blob,
	`status` integer,
	`expiration_date` integer,
	`accepted_at` integer,
	`rejected_at` integer,
	`rejected_reason` text(255),
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`sender_seeker_id`) REFERENCES `seekers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_seeker_id`) REFERENCES `seekers`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`sender_guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`receiver_guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `requirements` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`guild_id` blob,
	`verified` integer,
	`partnered` integer,
	`minimum_age` integer,
	`minimum_boosts` integer,
	`minimum_members` integer,
	`creation_date` integer,
	`mfa_level` integer,
	`nsfw_content_level` integer,
	`verification_level` integer,
	`explicit_content_level` integer,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `requirements_locale` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`requirements_id` text(36),
	`locale` text(8),
	`excluded` integer,
	FOREIGN KEY (`requirements_id`) REFERENCES `requirements`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `seekers` (
	`id` blob PRIMARY KEY NOT NULL,
	`verified` integer DEFAULT false,
	`created_at` integer,
	`updated_at` integer
);
--> statement-breakpoint
CREATE TABLE `template_mention` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`template_id` text(36),
	`role_id` blob NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`template_id`) REFERENCES `template`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `template` (
	`id` text(36) PRIMARY KEY NOT NULL,
	`guild_id` blob,
	`active_embed_id` text(36),
	`name` text(25) NOT NULL,
	`created_at` integer,
	`updated_at` integer,
	FOREIGN KEY (`guild_id`) REFERENCES `guild`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `alliances_idx_sender_seeker` ON `alliance` (`sender_seeker_id`);--> statement-breakpoint
CREATE INDEX `alliances_idx_receiver_seeker` ON `alliance` (`receiver_seeker_id`);--> statement-breakpoint
CREATE INDEX `alliances_idx_sender_guild` ON `alliance` (`sender_guild_id`);--> statement-breakpoint
CREATE INDEX `alliances_idx_receiver_guild` ON `alliance` (`receiver_guild_id`);--> statement-breakpoint
CREATE INDEX `alliances_idx_status` ON `alliance` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `blacklist_guild_id_unique` ON `blacklist` (`guild_id`);--> statement-breakpoint
CREATE INDEX `blacklists_idx_guild_id` ON `blacklist` (`guild_id`);--> statement-breakpoint
CREATE INDEX `blacklists_idx_user_id` ON `blacklist` (`user_id`);--> statement-breakpoint
CREATE INDEX `embeds_fields_idx_embed_id` ON `embed_field` (`embed_id`);--> statement-breakpoint
CREATE INDEX `embeds_fields_idx_name` ON `embed_field` (`name`);--> statement-breakpoint
CREATE INDEX `embeds_fields_idx_value` ON `embed_field` (`value`);--> statement-breakpoint
CREATE INDEX `embeds_fields_idx_inline` ON `embed_field` (`inline`);--> statement-breakpoint
CREATE UNIQUE INDEX `embeds_idx_guild_id_name` ON `embed` (`guild_id`,`name`);--> statement-breakpoint
CREATE INDEX `embeds_idx_guild_id` ON `embed` (`guild_id`);--> statement-breakpoint
CREATE INDEX `embeds_idx_name` ON `embed` (`name`);--> statement-breakpoint
CREATE INDEX `embeds_idx_active` ON `embed` (`active`);--> statement-breakpoint
CREATE UNIQUE INDEX `guild_blacklists_idx_guild_id_blacklisted_guild_id` ON `guild_blacklist` (`guild_id`,`blacklisted_guild_id`);--> statement-breakpoint
CREATE INDEX `guild_blacklists_idx_guild_id` ON `guild_blacklist` (`guild_id`);--> statement-breakpoint
CREATE INDEX `guild_blacklists_idx_user_id` ON `guild_blacklist` (`user_id`);--> statement-breakpoint
CREATE INDEX `guild_blacklists_idx_blacklisted_guild_id` ON `guild_blacklist` (`blacklisted_guild_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `guild_seekers_idx_guild_id_seeker_id` ON `guild_seekers` (`user_id`,`guild_id`);--> statement-breakpoint
CREATE INDEX `guilds_idx_subscription_plan` ON `guild` (`subscription_plan`);--> statement-breakpoint
CREATE INDEX `guilds_idx_alliances_channel_id` ON `guild` (`alliances_channel_id`);--> statement-breakpoint
CREATE INDEX `guilds_idx_partnerships_channel_id` ON `guild` (`partnerships_channel_id`);--> statement-breakpoint
CREATE INDEX `partnerships_idx_sender_seeker` ON `partnership` (`sender_seeker_id`);--> statement-breakpoint
CREATE INDEX `partnerships_idx_receiver_seeker` ON `partnership` (`receiver_seeker_id`);--> statement-breakpoint
CREATE INDEX `partnerships_idx_sender_guild` ON `partnership` (`sender_guild_id`);--> statement-breakpoint
CREATE INDEX `partnerships_idx_receiver_guild` ON `partnership` (`receiver_guild_id`);--> statement-breakpoint
CREATE INDEX `partnerships_idx_status` ON `partnership` (`status`);--> statement-breakpoint
CREATE UNIQUE INDEX `requirements_locales_idx_requirements_id_locale` ON `requirements_locale` (`requirements_id`,`locale`);--> statement-breakpoint
CREATE INDEX `requirements_locales_idx_locale` ON `requirements_locale` (`locale`);--> statement-breakpoint
CREATE INDEX `requirements_locales_idx_excluded` ON `requirements_locale` (`excluded`);--> statement-breakpoint
CREATE UNIQUE INDEX `template_mentions_idx_template_id_role_id` ON `template_mention` (`template_id`,`role_id`);--> statement-breakpoint
CREATE INDEX `template_mentions_idx_role_id` ON `template_mention` (`role_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `templates_idx_guild_id_name` ON `template` (`guild_id`,`name`);--> statement-breakpoint
CREATE INDEX `templates_idx_guild_id` ON `template` (`guild_id`);--> statement-breakpoint
CREATE INDEX `templates_idx_name` ON `template` (`name`);--> statement-breakpoint
CREATE INDEX `templates_idx_active_embed_id` ON `template` (`active_embed_id`);