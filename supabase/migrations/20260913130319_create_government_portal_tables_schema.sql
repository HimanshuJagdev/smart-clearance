/*
# Government Portal Integration + AI Assistant Tables — Schema

## Overview
Creates tables for government portal integration and AI assistant chat history.

## New Tables
1. government_portals — catalog of connected government department portals
2. service_requests — applications synced from government portals
3. ai_conversations — AI assistant chat sessions
4. ai_messages — individual messages within AI conversations

## Security
Single-tenant app (no auth screen). All policies use TO anon, authenticated.
RLS enabled on every table.
*/

-- 1. government_portals
CREATE TABLE IF NOT EXISTS government_portals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  description text NOT NULL,
  category text NOT NULL,
  api_endpoint text NOT NULL DEFAULT '',
  api_key text,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'maintenance')),
  logo_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE government_portals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_portals" ON government_portals;
CREATE POLICY "anon_select_portals" ON government_portals FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_portals" ON government_portals;
CREATE POLICY "anon_insert_portals" ON government_portals FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_portals" ON government_portals;
CREATE POLICY "anon_update_portals" ON government_portals FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_portals" ON government_portals;
CREATE POLICY "anon_delete_portals" ON government_portals FOR DELETE
  TO anon, authenticated USING (true);

-- 2. service_requests
CREATE TABLE IF NOT EXISTS service_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  portal_id uuid REFERENCES government_portals(id) ON DELETE CASCADE,
  reference_number text NOT NULL,
  service_name text NOT NULL,
  applicant_name text NOT NULL DEFAULT '',
  applicant_company text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'review', 'query', 'approved', 'rejected')),
  submitted_date timestamptz DEFAULT now(),
  last_updated timestamptz DEFAULT now(),
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE service_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_requests" ON service_requests;
CREATE POLICY "anon_select_requests" ON service_requests FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_requests" ON service_requests;
CREATE POLICY "anon_insert_requests" ON service_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_requests" ON service_requests;
CREATE POLICY "anon_update_requests" ON service_requests FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_requests" ON service_requests;
CREATE POLICY "anon_delete_requests" ON service_requests FOR DELETE
  TO anon, authenticated USING (true);

-- 3. ai_conversations
CREATE TABLE IF NOT EXISTS ai_conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL DEFAULT 'New Conversation',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_conversations" ON ai_conversations;
CREATE POLICY "anon_select_conversations" ON ai_conversations FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_conversations" ON ai_conversations;
CREATE POLICY "anon_insert_conversations" ON ai_conversations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_conversations" ON ai_conversations;
CREATE POLICY "anon_update_conversations" ON ai_conversations FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_conversations" ON ai_conversations;
CREATE POLICY "anon_delete_conversations" ON ai_conversations FOR DELETE
  TO anon, authenticated USING (true);

-- 4. ai_messages
CREATE TABLE IF NOT EXISTS ai_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  content text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE ai_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_messages" ON ai_messages;
CREATE POLICY "anon_select_messages" ON ai_messages FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_messages" ON ai_messages;
CREATE POLICY "anon_insert_messages" ON ai_messages FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_messages" ON ai_messages;
CREATE POLICY "anon_update_messages" ON ai_messages FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_messages" ON ai_messages;
CREATE POLICY "anon_delete_messages" ON ai_messages FOR DELETE
  TO anon, authenticated USING (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_service_requests_portal_id ON service_requests(portal_id);
CREATE INDEX IF NOT EXISTS idx_ai_messages_conversation_id ON ai_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_updated_at ON ai_conversations(updated_at DESC);