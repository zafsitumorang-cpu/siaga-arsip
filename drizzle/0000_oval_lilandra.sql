CREATE TABLE `archives` (
	`id` text PRIMARY KEY NOT NULL,
	`archive_number` text NOT NULL,
	`title` text NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`subbagian` text NOT NULL,
	`classification_code` text NOT NULL,
	`archive_date` text NOT NULL,
	`status` text DEFAULT 'Menunggu Verifikasi' NOT NULL,
	`confidentiality` text DEFAULT 'Internal' NOT NULL,
	`file_name` text NOT NULL,
	`file_key` text,
	`file_size` integer DEFAULT 0 NOT NULL,
	`mime_type` text DEFAULT 'application/pdf' NOT NULL,
	`uploaded_by` text NOT NULL,
	`uploaded_at` text NOT NULL,
	`verified_by` text,
	`verified_at` text,
	`notes` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `archives_archive_number_unique` ON `archives` (`archive_number`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`user_name` text NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text NOT NULL,
	`detail` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `classifications` (
	`id` text PRIMARY KEY NOT NULL,
	`code` text NOT NULL,
	`name` text NOT NULL,
	`retention_years` integer DEFAULT 5 NOT NULL,
	`description` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `classifications_code_unique` ON `classifications` (`code`);--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text DEFAULT 'operator' NOT NULL,
	`subbagian` text DEFAULT 'Administrasi' NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text NOT NULL
);
