CREATE TABLE `mod_infos` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`mod_id` text NOT NULL,
	`icon_url` text,
	`name` text,
	`description` text,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `mod_infos_mod_id_unique` ON `mod_infos` (`mod_id`);--> statement-breakpoint
CREATE TABLE `mod_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`mod_id` text NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`date` text NOT NULL,
	`game_version` text NOT NULL,
	`loader` text NOT NULL,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `mods` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`url` text NOT NULL,
	`provider` text NOT NULL
);
