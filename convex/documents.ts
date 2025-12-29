import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { auth } from "./auth";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return [];
    
    return await ctx.db
      .query("documents")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) return null;
    
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) return null;
    
    return document;
  },
});

export const create = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const now = Date.now();
    return await ctx.db.insert("documents", {
      userId,
      title: args.title,
      content: "",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("documents"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }
    
    const updates: { title?: string; content?: string; updatedAt: number } = {
      updatedAt: Date.now(),
    };
    
    if (args.title !== undefined) updates.title = args.title;
    if (args.content !== undefined) updates.content = args.content;
    
    await ctx.db.patch(args.id, updates);
  },
});

export const remove = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => {
    const userId = await auth.getUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    
    const document = await ctx.db.get(args.id);
    if (!document || document.userId !== userId) {
      throw new Error("Document not found");
    }
    
    // Delete associated knowledge
    const knowledge = await ctx.db
      .query("knowledge")
      .withIndex("by_document", (q) => q.eq("documentId", args.id))
      .collect();
    
    for (const k of knowledge) {
      await ctx.db.delete(k._id);
    }
    
    await ctx.db.delete(args.id);
  },
});

