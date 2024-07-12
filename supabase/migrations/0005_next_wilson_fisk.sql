CREATE TABLE IF NOT EXISTS "quizzes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"questions" jsonb NOT NULL,
	"total_points" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quizzes_user_id_idx" ON "quizzes" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quizzes_created_at_idx" ON "quizzes" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "quizzes_name_idx" ON "quizzes" USING btree ("name");