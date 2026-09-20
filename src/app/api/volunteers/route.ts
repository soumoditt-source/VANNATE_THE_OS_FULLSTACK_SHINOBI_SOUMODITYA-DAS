import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    totalVolunteersActive: 37,
    deployedInField: 28,
    onStandby: 9,
    heatmap: [
      { id: "vol_101", name: "Ananya Sharma", role: "Triage Medic", lat: 22.5726, lng: 88.3639, status: "On Mission", zone: "Ward 14 Flood Shelter", battery: "92%" },
      { id: "vol_102", name: "Rahul Mukherjee", role: "Heavy Logistics Driver", lat: 22.5800, lng: 88.3460, status: "On Mission", zone: "Howrah Supply Depot", battery: "84%" },
      { id: "vol_103", name: "Pooja Das", role: "Biometric KYC Lead", lat: 22.5186, lng: 88.3658, status: "Available", zone: "Salt Lake Camp 3", battery: "95%" },
      { id: "vol_104", name: "Vikram Sengupta", role: "Drone Recon Specialist", lat: 22.0154, lng: 88.7591, status: "On Mission", zone: "Sundarbans Coastal Sector", battery: "78%" },
      { id: "vol_105", name: "Sneha Roy", role: "Tele-Health Counselor", lat: 22.5357, lng: 88.3428, status: "Available", zone: "Command HQ", battery: "100%" }
    ],
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { taskId, volunteerId = "vol_101", missionType = "Ration Distribution" } = body;

    return NextResponse.json({
      success: true,
      assignmentId: `ASN-${Date.now().toString(36).toUpperCase()}`,
      volunteerId,
      taskId,
      missionType,
      telemetryTracking: "ACTIVE",
      geofenceRadiusMeters: 500,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ error: "Invalid volunteer assignment payload" }, { status: 400 });
  }
}
