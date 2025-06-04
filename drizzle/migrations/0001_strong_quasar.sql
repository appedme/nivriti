CREATE INDEX `chapters_story_id_idx` ON `chapters` (`story_id`);--> statement-breakpoint
CREATE INDEX `chapters_order_idx` ON `chapters` (`story_id`,`order_index`);