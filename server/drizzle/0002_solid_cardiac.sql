CREATE TABLE `pic_to_projects` (
	`id` int AUTO_INCREMENT NOT NULL,
	`pic_id` int NOT NULL,
	`project_id` int NOT NULL,
	CONSTRAINT `pic_to_projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `pic_to_projects_pic_id_project_id_unique` UNIQUE(`pic_id`,`project_id`)
);
--> statement-breakpoint
ALTER TABLE `pic_to_projects` ADD CONSTRAINT `pic_to_projects_pic_id_pics_id_fk` FOREIGN KEY (`pic_id`) REFERENCES `pics`(`id`) ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE `pic_to_projects` ADD CONSTRAINT `pic_to_projects_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE cascade;