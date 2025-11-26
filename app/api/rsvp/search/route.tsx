import { NextResponse } from "next/server";

// use GET for fetching insensitive data
export async function GET(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}

// use POST for modifying data or transmitting sensitive data
export async function POST(request) {
  // Do whatever you want
  return NextResponse.json({ message: "Hello World" }, { status: 200 });
}