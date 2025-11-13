CREATE TABLE `pics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`table_id` int NOT NULL,
	`seat_id` int NOT NULL,
	`profile_image` text,
	CONSTRAINT `pics_id` PRIMARY KEY(`id`)
);
