PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mod_versions` (
	`id` text PRIMARY KEY NOT NULL,
	`mod_id` text NOT NULL,
	`name` text NOT NULL,
	`version` text NOT NULL,
	`date` text NOT NULL,
	`game_version` text NOT NULL,
	`loader` text NOT NULL,
	`download_url` text NOT NULL,
	`file_name` text NOT NULL,
	`file_size` integer NOT NULL,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_mod_versions`("id", "mod_id", "name", "version", "date", "game_version", "loader", "download_url", "file_name", "file_size") SELECT "id", "mod_id", "name", "version", "date", "game_version", "loader", "download_url", "file_name", "file_size" FROM `mod_versions`;--> statement-breakpoint
DROP TABLE `mod_versions`;--> statement-breakpoint
ALTER TABLE `__new_mod_versions` RENAME TO `mod_versions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;