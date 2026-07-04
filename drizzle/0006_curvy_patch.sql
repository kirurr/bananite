PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profiles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`game_version` text,
	`loader` text,
	FOREIGN KEY (`game_version`) REFERENCES `game_versions`(`version`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`loader`) REFERENCES `loaders`(`name`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_profiles`("id", "name", "game_version", "loader") SELECT "id", "name", "game_version", "loader" FROM `profiles`;--> statement-breakpoint
DROP TABLE `profiles`;--> statement-breakpoint
ALTER TABLE `__new_profiles` RENAME TO `profiles`;--> statement-breakpoint
PRAGMA foreign_keys=ON;