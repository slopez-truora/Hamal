/**
 * Envío outbound WhatsApp (Truora Connect) — misma lógica que SavingsForm.
 */
export async function sendWhatsappOutbound(params: {
  country_code: string;
  phone_number: string;
}): Promise<void> {
  const formData = new URLSearchParams();
  formData.append("outbound_id", import.meta.env.VITE_OUTBOUND_ID || "");
  formData.append("country_code", params.country_code);
  formData.append("phone_number", params.phone_number);
  formData.append("flow_id", import.meta.env.VITE_FLOW_ID || "");
  formData.append("user_authorized", "true");

  const response = await fetch(import.meta.env.VITE_API_URL || "", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Truora-API-Key": import.meta.env.VITE_TRUORA_API_KEY || "",
    },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorData;
    try {
      errorData = JSON.parse(errorText);
    } catch {
      errorData = errorText;
    }
    console.group("❌ Error outbound WhatsApp");
    console.error("Status:", response.status);
    console.error("Respuesta del servidor:", errorData);
    console.error("Datos enviados:", Object.fromEntries(formData.entries()));
    console.groupEnd();
    throw new Error(`Fallo outbound WhatsApp (Status: ${response.status})`);
  }

  await response.json();
}

const COUNTRY_CODES_DESC = ["+52", "+34", "+54", "+56", "+57", "+51", "+1"];

export function splitFullPhoneForOutbound(fullPhone: string): {
  country_code: string;
  phone_number: string;
} {
  const normalized = fullPhone.startsWith("+") ? fullPhone : `+${fullPhone}`;
  for (const code of COUNTRY_CODES_DESC) {
    if (normalized.startsWith(code)) {
      return {
        country_code: code,
        phone_number: normalized.slice(code.length),
      };
    }
  }
  const m = normalized.match(/^(\+\d{1,3})(\d+)$/);
  if (m) {
    return { country_code: m[1], phone_number: m[2] };
  }
  throw new Error("No se pudo interpretar el número de teléfono");
}
