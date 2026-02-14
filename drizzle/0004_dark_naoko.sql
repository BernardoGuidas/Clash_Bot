CREATE TABLE `clans` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`tag` varchar(20) NOT NULL,
	`description` text,
	`trophies` int NOT NULL DEFAULT 0,
	`memberCount` int NOT NULL DEFAULT 0,
	`requiredTrophies` int NOT NULL DEFAULT 0,
	`region` varchar(50),
	`badgeUrl` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `clans_id` PRIMARY KEY(`id`),
	CONSTRAINT `clans_tag_unique` UNIQUE(`tag`)
);
--> statement-breakpoint
CREATE TABLE `players` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(100) NOT NULL,
	`tag` varchar(20) NOT NULL,
	`trophies` int NOT NULL DEFAULT 0,
	`bestTrophies` int NOT NULL DEFAULT 0,
	`wins` int NOT NULL DEFAULT 0,
	`losses` int NOT NULL DEFAULT 0,
	`level` int NOT NULL DEFAULT 1,
	`arena` varchar(50),
	`clanId` int,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `players_id` PRIMARY KEY(`id`),
	CONSTRAINT `players_tag_unique` UNIQUE(`tag`)
);
