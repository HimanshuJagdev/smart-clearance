import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface PortalRow {
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

interface ServiceRequestRow {
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

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname.replace(/^\/functions\/v1\/government-portal\/?/, "");
    const segments = path.split("/").filter(Boolean);

    // GET /portals — list all government portals
    if (req.method === "GET" && (segments.length === 0 || segments[0] === "portals")) {
      const { data, error } = await supabase
        .from("government_portals")
        .select("*")
        .order("name");

      if (error) throw error;

      const portals = (data as PortalRow[]).map((p) => ({
        id: p.id,
        name: p.name,
        code: p.code,
        description: p.description,
        category: p.category,
        apiEndpoint: p.api_endpoint,
        status: p.status,
        logoUrl: p.logo_url,
        createdAt: p.created_at,
      }));

      return new Response(JSON.stringify({ portals }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /portals/:code/requests — list service requests for a portal
    if (req.method === "GET" && segments.length === 3 && segments[0] === "portals" && segments[2] === "requests") {
      const portalCode = segments[1];
      const { data: portal } = await supabase
        .from("government_portals")
        .select("id")
        .eq("code", portalCode)
        .maybeSingle();

      if (!portal) {
        return new Response(JSON.stringify({ error: "Portal not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("service_requests")
        .select("*")
        .eq("portal_id", portal.id)
        .order("last_updated", { ascending: false });

      if (error) throw error;

      const requests = (data as ServiceRequestRow[]).map((r) => ({
        id: r.id,
        referenceNumber: r.reference_number,
        serviceName: r.service_name,
        applicantName: r.applicant_name,
        applicantCompany: r.applicant_company,
        status: r.status,
        submittedDate: r.submitted_date,
        lastUpdated: r.last_updated,
        payload: r.payload,
      }));

      return new Response(JSON.stringify({ requests }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /requests — list all service requests
    if (req.method === "GET" && segments[0] === "requests") {
      const { data, error } = await supabase
        .from("service_requests")
        .select("*, government_portals(name, code, category)")
        .order("last_updated", { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify({ requests: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // GET /requests/:referenceNumber — get a single service request
    if (req.method === "GET" && segments.length === 2 && segments[0] === "requests") {
      const refNum = segments[1];
      const { data, error } = await supabase
        .from("service_requests")
        .select("*, government_portals(name, code, category)")
        .eq("reference_number", refNum)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "Request not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ request: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /requests — create/sync a new service request (used by government portals to push updates)
    if (req.method === "POST" && segments[0] === "requests") {
      const body = await req.json();
      const { portalCode, referenceNumber, serviceName, applicantName, applicantCompany, status, payload } = body;

      if (!portalCode || !referenceNumber || !serviceName) {
        return new Response(JSON.stringify({ error: "Missing required fields: portalCode, referenceNumber, serviceName" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: portal } = await supabase
        .from("government_portals")
        .select("id")
        .eq("code", portalCode)
        .maybeSingle();

      if (!portal) {
        return new Response(JSON.stringify({ error: "Portal not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("service_requests")
        .upsert({
          portal_id: portal.id,
          reference_number: referenceNumber,
          service_name: serviceName,
          applicant_name: applicantName || "",
          applicant_company: applicantCompany || "",
          status: status || "pending",
          submitted_date: body.submittedDate || new Date().toISOString(),
          last_updated: new Date().toISOString(),
          payload: payload || {},
        }, { onConflict: "reference_number" })
        .select()
        .single();

      if (error) throw error;

      return new Response(JSON.stringify({ request: data }), {
        status: 201,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // PUT /requests/:referenceNumber — update a service request (e.g. status change from portal)
    if (req.method === "PUT" && segments.length === 2 && segments[0] === "requests") {
      const refNum = segments[1];
      const body = await req.json();
      const updates: Record<string, unknown> = { last_updated: new Date().toISOString() };
      if (body.status) updates.status = body.status;
      if (body.payload) updates.payload = body.payload;
      if (body.serviceName) updates.service_name = body.serviceName;

      const { data, error } = await supabase
        .from("service_requests")
        .update(updates)
        .eq("reference_number", refNum)
        .select()
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        return new Response(JSON.stringify({ error: "Request not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ request: data }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // POST /sync/:portalCode — fetch from external government portal API and update local records
    if (req.method === "POST" && segments.length === 2 && segments[0] === "sync") {
      const portalCode = segments[1];
      const { data: portal } = await supabase
        .from("government_portals")
        .select("*")
        .eq("code", portalCode)
        .maybeSingle() as { data: PortalRow | null; error: null };

      if (!portal) {
        return new Response(JSON.stringify({ error: "Portal not found" }), {
          status: 404,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!portal.api_endpoint) {
        return new Response(JSON.stringify({ error: "Portal has no API endpoint configured" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Attempt to fetch from the external government portal API
      const fetchHeaders: Record<string, string> = { "Content-Type": "application/json" };
      if (portal.api_key) {
        fetchHeaders["Authorization"] = `Bearer ${portal.api_key}`;
      }

      try {
        const externalResp = await fetch(`${portal.api_endpoint}/requests`, {
          headers: fetchHeaders,
          signal: AbortSignal.timeout(8000),
        });

        if (!externalResp.ok) {
          return new Response(JSON.stringify({
            error: `External portal returned status ${externalResp.status}`,
            portal: portal.name,
            synced: false,
          }), {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const externalData = await externalResp.json();
        const externalRequests = externalData.requests || externalData.data || [];

        let syncedCount = 0;
        for (const extReq of externalRequests) {
          await supabase
            .from("service_requests")
            .upsert({
              portal_id: portal.id,
              reference_number: extReq.referenceNumber || extReq.reference_number,
              service_name: extReq.serviceName || extReq.service_name,
              applicant_name: extReq.applicantName || extReq.applicant_name || "",
              applicant_company: extReq.applicantCompany || extReq.applicant_company || "",
              status: extReq.status || "pending",
              submitted_date: extReq.submittedDate || extReq.submitted_date || new Date().toISOString(),
              last_updated: new Date().toISOString(),
              payload: extReq.payload || {},
            }, { onConflict: "reference_number" });
          syncedCount++;
        }

        return new Response(JSON.stringify({
          portal: portal.name,
          synced: true,
          count: syncedCount,
        }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      } catch (fetchErr) {
        const errMsg = fetchErr instanceof Error ? fetchErr.message : "Unknown error";
        return new Response(JSON.stringify({
          error: `Failed to reach external portal: ${errMsg}`,
          portal: portal.name,
          synced: false,
        }), {
          status: 502,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
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
