ALTER TABLE `tasks` MODIFY COLUMN `is_deleted` boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE `pics` ADD `is_deleted` boolean DEFAULT false;