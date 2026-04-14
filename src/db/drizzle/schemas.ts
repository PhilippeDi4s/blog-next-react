import { InferInsertModel, InferSelectModel } from "drizzle-orm";
import { integer, text, sqliteTable } from "drizzle-orm/sqlite-core";

export const postsTable = sqliteTable("posts", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImageUrl: text("cover_image_url").notNull(),
  published: integer("published", { mode: "boolean" }).notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
  author: text("author").notNull(),
});

export type PostsTableSelectedMode = InferSelectModel<typeof postsTable>;
export type PostsTableInsert = InferInsertModel<typeof postsTable>;
