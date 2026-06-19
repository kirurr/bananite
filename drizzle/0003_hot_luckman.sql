CREATE TABLE `game_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`game_path` text NOT NULL,
	`download_path` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `profile_mods` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`profile_id` integer NOT NULL,
	`mod_id` text NOT NULL,
	FOREIGN KEY (`profile_id`) REFERENCES `profiles`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` integer,
	`game_version` text,
	`loader` text,
	FOREIGN KEY (`game_version`) REFERENCES `game_versions`(`version`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loader`) REFERENCES `loaders`(`name`) ON UPDATE no action ON DELETE no action
);
