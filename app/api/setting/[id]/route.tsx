import { NextResponse } from "next/server";
import { auth } from "@/app/lib/auth";
import { updateSetting } from "@/app/lib/settings";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const contentType = request.headers.get("content-type") || "";

  if (!contentType.includes("application/json")) {
    return NextResponse.json({ error: "JSON body required" }, { status: 400 });
  }

  let body: { value?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!id) {
    return NextResponse.json({ error: "Setting ID is required" }, { status: 400 });
  }

  const value =
    typeof body.value === "string"
      ? body.value
      : body.value === null
        ? null
        : body.value === undefined
          ? null
          : String(body.value);

  try {
    const updatedSetting = await updateSetting(id, value);

    if (!updatedSetting) {
      return NextResponse.json({ error: "Setting not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, setting: updatedSetting });
  } catch (error) {
    console.error("Error updating setting:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}