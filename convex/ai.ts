import { v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import OpenAI from "openai";

export const chat = action({
  args: {
    documentId: v.id("documents"),
    message: v.string(),
    currentContent: v.string(),
  },
  handler: async (ctx, args) => {
    // Get knowledge for context
    const knowledge = await ctx.runQuery(api.knowledge.list, {
      documentId: args.documentId,
    });
    
    // Get document info
    const document = await ctx.runQuery(api.documents.get, {
      id: args.documentId,
    });
    
    if (!document) {
      throw new Error("Document not found");
    }
    
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    
    // Build context from knowledge
    const knowledgeContext = knowledge.length > 0
      ? `\n\nReference Knowledge:\n${knowledge.map(k => `### ${k.title}\n${k.content}`).join("\n\n")}`
      : "";
    
    const systemPrompt = `You are a helpful AI writing assistant. You help users write and edit documents.
The user is working on a document titled "${document.title}".

Current document content:
${args.currentContent || "(Empty document)"}
${knowledgeContext}

When the user asks you to write or edit content:
1. If they ask to write new content, provide the text they should add
2. If they ask to edit existing content, provide the updated version
3. Reference the knowledge provided when relevant
4. Keep your responses focused and helpful
5. Format your response as the actual content to be added/changed, not as a conversation

If the user is asking a question or for advice (not asking you to write), respond conversationally.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: args.message },
      ],
      max_tokens: 2000,
    });
    
    return response.choices[0]?.message?.content || "I couldn't generate a response.";
  },
});

