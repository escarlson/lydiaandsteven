import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import fetchAllSettings from "@/app/lib/settings";

export async function GET(request: Request) {
  // Require authorization to fetch all RSVPs
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const settings = await fetchAllSettings();

    return NextResponse.json({
      success: true,
      settings
    });
  } catch (error) {
    console.error("Error fetching settings");
    throw error;
  }
};