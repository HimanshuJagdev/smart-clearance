/*
# Government Portal Integration + AI Assistant Tables

## Overview
Creates the database schema for SmartClearance to integrate with external
government portals via a REST API, and to power a personal AI assistant that
answers questions about applications, compliance, and approvals.

## New Tables

### 1. government_portals
Catalog of government departments/portals that SmartClearance integrates with.
- id (uuid, PK)
- name (text) — e.g. "Maharashtra Fire Services"
- code (text, unique) — short code like "MFS"
- description (text)
- category (text) — e.g. "Fire Safety", "Industrial Safety"
- api_endpoint (text) — base URL for external portal REST API
- api_key (text, nullable) — stored key for authenticating to the external API
- status (text) — 'active' | 'inactive' | 'maintenance'
- logo_url (text, nullable)
- created_at (timestamptz)

### 2. service_requests
Applications/service requests synced between SmartClearance and government portals.
- id (uuid, PK)
- portal_id (uuid, FK → government_portals)
- reference_number (text) — the tracking number from the government portal
- service_name (text) — e.g. "Fire NOC", "Factory License"
- applicant_name (text)
- applicant_company (text)
- status (text) — 'pending' | 'review' | 'query' | 'approved' | 'rejected'
- submitted_date (timestamptz)
- last_updated (timestamptz)
- payload (jsonb) — full request data from the portal, flexible schema
- created_at (timestamptz)

### 3. ai_conversations
Conversation sessions for the personal AI assistant.
- id (uuid, PK)
- title (text) — auto-generated from first message
- created_at (timestamptz)
- updated_at (timestamptz)

### 4. ai_messages
Individual messages within an AI conversation.
- id (uuid, PK)
- conversation_id (uuid, FK → ai_conversations, ON DELETE CASCADE)
- role (text) — 'user' | 'assistant'
- content (text)
- metadata (jsonb, nullable) — e.g. referenced application IDs, sources
- created_at (timestamptz)

## Security
This is a single-tenant app (no sign-in screen in the current prototype).
All tables use TO anon, authenticated policies so the anon-key frontend can
read and write data. RLS is enabled on every table.

## Notes
1. government_portals is fully readable/writable by anon for the prototype.
2. service_requests stores portal-synced data in jsonb for flexibility.
3. ai_conversations and ai_messages store the chat history for the AI assistant.
4. The edge functions (government-portal, ai-assistant) handle the actual
   external API calls and AI logic respectively.
*/