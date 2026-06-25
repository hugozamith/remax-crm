import { NextResponse } from "next/server";
import { getDatabaseConfigSource, resolveDatabaseUrl } from "@/lib/database-url";

export function GET() {
  try {
    resolveDatabaseUrl();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      source: getDatabaseConfigSource(),
    });
  } catch {
    return NextResponse.json(
      {
        status: "error",
        database: "not configured",
        hint: "Add Postgres variable references on Railway (see RAILWAY.md)",
      },
      { status: 503 }
    );
  }
}
