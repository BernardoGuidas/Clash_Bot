CREATE TABLE `cardStats` (
	`id` int AUTO_INCREMENT NOT NULL,
	`cardId` int NOT NULL,
	`usageCount` int NOT NULL DEFAULT 0,
	`winRate` int NOT NULL DEFAULT 0,
	`pickRate` int NOT NULL DEFAULT 0,
	`avgDeckPosition` int DEFAULT 0,
	`lastUpdated` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `cardStats_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `cardStats` ADD CONSTRAINT `cardStats_cardId_cards_id_fk` FOREIGN KEY (`cardId`) REFERENCES `cards`(`id`) ON DELETE no action ON UPDATE no action;