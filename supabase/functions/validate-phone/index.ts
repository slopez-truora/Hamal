import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface ValidatePhoneRequest {
  country_code: string;
  phone_number: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { country_code, phone_number }: ValidatePhoneRequest = await req.json();

    if (!country_code || !phone_number) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing country_code or phone_number",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: existingUser, error: queryError } = await supabase
      .from("users")
      .select("id, validation_status")
      .eq("country_code", country_code)
      .eq("phone_number", phone_number)
      .maybeSingle();

    if (queryError) {
      console.error("Database query error:", queryError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Database error",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          exists: true,
          message: "This phone number is already registered",
          validation_status: existingUser.validation_status,
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    const { data: newUser, error: insertError } = await supabase
      .from("users")
      .insert({
        country_code,
        phone_number,
        validation_status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return new Response(
        JSON.stringify({
          success: false,
          error: "Failed to create user record",
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        can_proceed: true,
        user_id: newUser.id,
        message: "Phone number validated, you can proceed",
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: "Internal server error",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
