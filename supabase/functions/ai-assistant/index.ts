import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ConversationRow {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  role: string;
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Knowledge base for the AI assistant — simulates an AI that has context
// about the user's applications, compliance, and government services.
function generateResponse(userMessage: string, context: {
  requests: Record<string, unknown>[];
  portals: Record<string, unknown>[];
  complianceItems: Record<string, unknown>[];
}): string {
  const msg = userMessage.toLowerCase();

  const pending = context.requests.filter((r) => r.status === "review" || r.status === "pending");
  const queries = context.requests.filter((r) => r.status === "query");
  const approved = context.requests.filter((r) => r.status === "approved");
  const overdue = context.complianceItems.filter((c) => c.status === "overdue");

  // Greeting
  if (/hello|hi|hey|greetings/.test(msg)) {
    return `Hello! I'm your SmartClearance AI assistant. I can help you with:

1. **Application Status** — Ask about any of your pending or approved applications
2. **Compliance Deadlines** — Check upcoming or overdue compliance items
3. **Government Portals** — Get info about connected government services
4. **Risk Analysis** — Understand delay risks on your applications

You currently have ${context.requests.length} applications tracked. How can I help you today?`;
  }

  // Application status
  if (/status|application|approval|track/.test(msg)) {
    const lines = context.requests.map((r) => {
      const status = r.status as string;
      const icon = status === "approved" ? "✅" : status === "query" ? "⚠️" : "🔄";
      return `${icon} **${r.service_name}** (${r.reference_number}) — ${status.toUpperCase()}\n   Last updated: ${r.last_updated}`;
    });
    return `Here's the status of all your applications:\n\n${lines.join("\n\n")}\n\n${
      queries.length > 0
        ? `⚠️ You have ${queries.length} application(s) with queries that need your attention.`
        : "Everything looks on track!"
    }`;
  }

  // Query-related
  if (/query|question|respond|clarif/.test(msg)) {
    if (queries.length === 0) {
      return "Great news! You have no pending queries from any government department right now. All your applications are proceeding normally.";
    }
    const queryList = queries.map((q) => {
      const payload = q.payload as Record<string, unknown>;
      return `**${q.service_name}** (${q.reference_number})\nQuery: ${payload.query || "Department needs additional information"}`;
    });
    return `You have ${queries.length} pending quer${queries.length === 1 ? "y" : "ies"}:\n\n${queryList.join("\n\n")}\n\nI recommend responding to these as soon as possible to avoid delays.`;
  }

  // Compliance
  if (/compliance|deadline|due|overdue|expir/.test(msg)) {
    if (overdue.length > 0) {
      return `⚠️ You have ${overdue.length} OVERDUE compliance item(s):\n\n${overdue.map((c) => `• **${c.name}** — was due ${c.dueDate}`).join("\n")}\n\nPlease address these immediately to avoid penalties.`;
    }
    return `Your compliance status looks good. You have ${context.complianceItems.length} upcoming compliance deadlines. Make sure to keep track of the due dates to stay compliant.`;
  }

  // Government services / portals
  if (/portal|government|service|department/.test(msg)) {
    const portalList = context.portals.map((p) => `• **${p.name}** (${p.code}) — ${p.status}`);
    return `You're connected to ${context.portals.length} government portals:\n\n${portalList.join("\n")}\n\nAll portals are accessible through the Government Services page. You can submit new applications, track existing ones, and download approved documents.`;
  }

  // Risk / delay
  if (/risk|delay|predict|how long|when/.test(msg)) {
    const highRisk = context.requests.filter((r) => {
      const payload = r.payload as Record<string, unknown>;
      return payload.riskLevel === "High";
    });
    if (highRisk.length > 0) {
      return `I've analyzed your applications for delay risk:\n\n${highRisk.map((r) => `⚠️ **${r.service_name}** has HIGH delay risk — consider addressing pending queries or missing documents.`).join("\n\n")}\n\nVisit the AI Insights page for detailed SHAP analysis of risk factors.`;
    }
    return `Based on my analysis, your applications have low to moderate delay risk. Most are progressing normally. Keep an eye on any queries from departments and respond promptly to minimize delays.`;
  }

  // Help / capabilities
  if (/help|what can|capab|assist/.test(msg)) {
    return `I'm your SmartClearance AI assistant. Here's what I can help with:

📋 **Application Tracking** — "What's the status of my applications?"
⚠️ **Queries** — "Do I have any pending queries?"
📅 **Compliance** — "What compliance deadlines are coming up?"
🏛️ **Government Portals** — "Which government portals am I connected to?"
📊 **Risk Analysis** — "Which applications have high delay risk?"

Just ask me a question in natural language!`;
  }

  // Default fallback
  return `I understand you're asking about "${userMessage}". I can help you with application statuses, compliance deadlines, government portal information, and delay risk analysis. Try asking:

• "What's the status of my Fire NOC?"
• "Do I have any pending queries?"
• "What compliance items are overdue?"
• "Which government portals am I connected to?"

How can I assist you further?`;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/functions\/v1\/ai-assistant\/?/, "");
    const segments = path.split("/").filter(Boolean);

    // GET /conversations — list all conversations
    if (req.method === "GET" && (segments.length === 0 || segments[0] === "conversations")) {
      const { data, error } = await supabase
        .from("ai_conversations")
        .select("*")
        .order("updated_at", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ conversations: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /conversations/:id/messages — get messages for a conversation
    if (req.method === "GET" && segments.length === 3 && segments[0] === "conversations" && segments[2] === "messages") {
      const conversationId = segments[1];
      const { data, error } = await supabase
        .from("ai_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) throw error;

      return new Response(JSON.stringify({ messages: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /chat — send a message and get an AI response
    if (req.method === "POST" && (segments[0] === "chat" || segments.length === 0)) {
      const body = await req.json();
      const { message, conversationId } = body;

      if (!message || typeof message !== "string") {
        return new Response(JSON.stringify({ error: "Missing 'message' field" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      let convId = conversationId;

      // Create a new conversation if none provided
      if (!convId) {
        const title = message.length > 40 ? message.substring(0, 40) + "..." : message;
        const { data: newConv, error: convError } = await supabase
          .from("ai_conversations")
          .insert({ title })
          .select()
          .single();

        if (convError) throw convError;
        convId = (newConv as ConversationRow).id;
      }

      // Save the user's message
      const { error: msgError } = await supabase
        .from("ai_messages")
        .insert({
          conversation_id: convId,
          role: "user",
          content: message,
        });

      if (msgError) throw msgError;

      // Gather context from the database for the AI response
      const [requestsResult, portalsResult] = await Promise.all([
        supabase.from("service_requests").select("*").order("last_updated", { ascending: false }),
        supabase.from("government_portals").select("*").order("name"),
      ]);

      // Build compliance context from mock data structure
      const complianceItems = [
        { name: "Factory Safety Renewal", dueDate: "18 Sep 2026", status: "upcoming" },
        { name: "Environmental Compliance Report", dueDate: "25 Sep 2026", status: "upcoming" },
        { name: "Fire Safety Inspection", dueDate: "03 Oct 2026", status: "upcoming" },
        { name: "GST Registration Renewal", dueDate: "15 Oct 2026", status: "upcoming" },
        { name: "Pollution Control Certificate", dueDate: "08 Sep 2026", status: "overdue" },
      ];

      const context = {
        requests: (requestsResult.data || []) as Record<string, unknown>[],
        portals: (portalsResult.data || []) as Record<string, unknown>[],
        complianceItems: complianceItems as Record<string, unknown>[],
      };

      const aiResponse = generateResponse(message, context);

      // Save the assistant's response
      const { error: aiMsgError } = await supabase
        .from("ai_messages")
        .insert({
          conversation_id: convId,
          role: "assistant",
          content: aiResponse,
          metadata: { sources: ["service_requests", "government_portals", "compliance"] },
        });

      if (aiMsgError) throw aiMsgError;

      // Update conversation timestamp
      await supabase
        .from("ai_conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", convId);

      return new Response(JSON.stringify({
        conversationId: convId,
        response: aiResponse,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // DELETE /conversations/:id — delete a conversation
    if (req.method === "DELETE" && segments.length === 2 && segments[0] === "conversations") {
      const convId = segments[1];
      const { error } = await supabase
        .from("ai_conversations")
        .delete()
        .eq("id", convId);

      if (error) throw error;

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const errMsg = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: errMsg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
