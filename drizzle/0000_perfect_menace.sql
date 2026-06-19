CREATE TABLE `game_versions` (
	`version` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `loaders` (
	`name` text PRIMARY KEY NOT NULL,
	`icon` text NOT NULL
);
