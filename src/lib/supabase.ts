import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface GovernmentPortal {
  id: string;
  name: string;
  code: string;
  description: string;
  category: string;
  api_endpoint: string;
  api_key: string | null;
  status: string;
  logo_url: string | null;
  created_at: string;
}

export interface ServiceRequest {
  id: string;
  portal_id: string;
  reference_number: string;
  service_name: string;
  applicant_name: string;
  applicant_company: string;
  status: string;
  submitted_date: string;
  last_updated: string;
  payload: Record<string, unknown>;
}

export interface AIConversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface AIMessage {
  id: string;
  conversation_id: string;
  role: 'user' | 'assistant';
  content: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const edgeFunctionUrl = (name: string) =>
  `${supabaseUrl}/functions/v1/${name}`;

const edgeFunctionHeaders = () => ({
  Authorization: `Bearer ${supabaseAnonKey}`,
  'Content-Type': 'application/json',
  apikey: supabaseAnonKey,
});

export const portalApi = {
  async getPortals(): Promise<GovernmentPortal[]> {
    const resp = await fetch(edgeFunctionUrl('government-portal/portals'), {
      headers: edgeFunctionHeaders(),
    });
    if (!resp.ok) throw new Error(`Failed to fetch portals (${resp.status})`);
    const data = await resp.json();
    return data.portals || [];
  },

  async getRequests(): Promise<ServiceRequest[]> {
    const resp = await fetch(edgeFunctionUrl('government-portal/requests'), {
      headers: edgeFunctionHeaders(),
    });
    if (!resp.ok) throw new Error(`Failed to fetch requests (${resp.status})`);
    const data = await resp.json();
    return data.requests || [];
  },

  async getPortalRequests(portalCode: string): Promise<ServiceRequest[]> {
    const resp = await fetch(
      edgeFunctionUrl(`government-portal/portals/${portalCode}/requests`),
      { headers: edgeFunctionHeaders() },
    );
    if (!resp.ok) throw new Error(`Failed to fetch portal requests (${resp.status})`);
    const data = await resp.json();
    return data.requests || [];
  },

  async syncPortal(portalCode: string): Promise<{ synced: boolean; count: number; error?: string }> {
    const resp = await fetch(
      edgeFunctionUrl(`government-portal/sync/${portalCode}`),
      { method: 'POST', headers: edgeFunctionHeaders() },
    );
    const data = await resp.json();
    if (!resp.ok) return { synced: false, count: 0, error: data.error || 'Sync failed' };
    return { synced: data.synced, count: data.count || 0, error: data.error };
  },
};

export const aiApi = {
  async getConversations(): Promise<AIConversation[]> {
    const resp = await fetch(edgeFunctionUrl('ai-assistant/conversations'), {
      headers: edgeFunctionHeaders(),
    });
    if (!resp.ok) throw new Error(`Failed to fetch conversations (${resp.status})`);
    const data = await resp.json();
    return data.conversations || [];
  },

  async getMessages(conversationId: string): Promise<AIMessage[]> {
    const resp = await fetch(
      edgeFunctionUrl(`ai-assistant/conversations/${conversationId}/messages`),
      { headers: edgeFunctionHeaders() },
    );
    if (!resp.ok) throw new Error(`Failed to fetch messages (${resp.status})`);
    const data = await resp.json();
    return data.messages || [];
  },

  async sendMessage(message: string, conversationId?: string): Promise<{ conversationId: string; response: string }> {
    const resp = await fetch(edgeFunctionUrl('ai-assistant/chat'), {
      method: 'POST',
      headers: edgeFunctionHeaders(),
      body: JSON.stringify({ message, conversationId }),
    });
    if (!resp.ok) throw new Error(`Chat request failed (${resp.status})`);
    const data = await resp.json();
    if (data.error) throw new Error(data.error);
    return { conversationId: data.conversationId, response: data.response };
  },

  async deleteConversation(conversationId: string): Promise<void> {
    const resp = await fetch(
      edgeFunctionUrl(`ai-assistant/conversations/${conversationId}`),
      { method: 'DELETE', headers: edgeFunctionHeaders() },
    );
    if (!resp.ok) throw new Error(`Failed to delete conversation (${resp.status})`);
  },
};
