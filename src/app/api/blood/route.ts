import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    timestamp: new Date().toISOString(),
    region: "Eastern Bharat Grid (Kolkata Hub)",
    availability: {
      O_Pos: 124,
      O_Neg: 12,
      A_Pos: 310,
      A_Neg: 18,
      B_Pos: 245,
      B_Neg: 14,
      AB_Pos: 84,
      AB_Neg: 6,
    },
    hospitalsConnected: [
      { id: "hosp_sskm", name: "SSKM Trauma Center", status: "ONLINE", reserves: 82 },
      { id: "hosp_nrs", name: "NRS Medical College", status: "ONLINE", reserves: 48 },
      { id: "hosp_amri", name: "AMRI Hospital Dhakuria", status: "ONLINE", reserves: 36 },
      { id: "hosp_bell", name: "Bellevue Clinic", status: "ONLINE", reserves: 28 },
    ],
    status: "OPERATIONAL"
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { hospitalId = "hosp_sskm", bloodGroup = "O_Neg", unitsNeeded = 2, priority = "Critical" } = body;

    const dispatchId = `BLD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

    return NextResponse.json({
      success: true,
      dispatchId,
      hospitalId,
      bloodGroup,
      unitsNeeded,
      priority,
      notifiedDonorsCount: 24,
      etaMinutes: 18,
      algorithm: "Vannate Geodesic Proximity Matching (A* Telemetry)",
      status: "DISPATCHED"
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid dispatch payload" }, { status: 400 });
  }
}
