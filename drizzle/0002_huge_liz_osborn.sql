PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_mod_infos` (
	`id` text PRIMARY KEY NOT NULL,
	`mod_id` text NOT NULL,
	`icon_url` text,
	`name` text,
	`description` text,
	FOREIGN KEY (`mod_id`) REFERENCES `mods`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_mod_infos`("id", "mod_id", "icon_url", "name", "description") SELECT "id", "mod_id", "icon_url", "name", "description" FROM `mod_infos`;--> statement-breakpoint
DROP TABLE `mod_infos`;--> statement-breakpoint
ALTER TABLE `__new_mod_infos` RENAME TO `mod_infos`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `mod_infos_mod_id_unique` ON `mod_infos` (`mod_id`);