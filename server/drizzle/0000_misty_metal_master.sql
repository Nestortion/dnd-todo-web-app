CREATE TABLE `tasks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` text NOT NULL,
	`description` text NOT NULL,
	`pic_id` int,
	`create_date` datetime DEFAULT now(),
	`complete_date` datetime,
	`due_date` datetime,
	`is_deleted` boolean DEFAULT true,
	`status` enum('Backlog','In Progress','Completed','For Testing','Reject','Finished') NOT NULL DEFAULT 'Backlog',
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
