"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// =========================================================================
// PIPELINE A: CREATE NEW DAILY ENTRY
// =========================================================================
export async function createLogbookEntryAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return { error: "Unauthorized operation exception." };
  }

  const dateStr = formData.get("date") as string;
  const weekNumber = parseInt(formData.get("weekNumber") as string, 10);
  const activityDetails = formData.get("activityDetails") as string;
  const hoursWorked = parseFloat(formData.get("hoursWorked") as string);

  if (!dateStr || isNaN(weekNumber) || !activityDetails || isNaN(hoursWorked)) {
    return { error: "Please populate all log requirements accurately." };
  }

  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return { error: "Student profile records missing configuration." };
    }

    await prisma.logbookEntry.create({
      data: {
        studentId: studentProfile.id,
        date: new Date(dateStr),
        weekNumber,
        activityDetails,
        hoursWorked,
      },
    });

    revalidatePath("/dashboard/logbook");
    return { success: true };
  } catch (error: any) {
    console.error("Logbook entry creation failure:", error);
    if (error?.code === "P2002") {
      return {
        error: "You have already committed a log entry for this specific date.",
      };
    }
    return { error: "Failed to synchronize entry to cloud cluster database." };
  }
}

// =========================================================================
// PIPELINE B: CORRECT FLAGGED ENTRY (Matches Schema Exactly)
// =========================================================================
export async function correctLogbookEntryAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return {
      error:
        "Security Exception: Unauthorized logbook modification parameters.",
    };
  }

  const entryId = formData.get("entryId") as string;
  const activityDetails = formData.get("activityDetails") as string;
  const hoursWorked = parseFloat(formData.get("hoursWorked") as string);

  if (!entryId || !activityDetails || isNaN(hoursWorked)) {
    return { error: "Missing required update fields." };
  }

  try {
    // Sync updates with exact schema field alignments
    await prisma.logbookEntry.update({
      where: { id: entryId },
      data: {
        activityDetails: activityDetails.trim(),
        hoursWorked: hoursWorked,
        orgApproved: false, // Reset validation gate flag
        acadApproved: false, // Reset validation gate flag
        orgFeedback: null, // Flush supervisor string data
        acadFeedback: null, // Flush supervisor string data
        orgApprovedAt: null, // Wipe past signature timestamp
        acadApprovedAt: null, // Wipe past signature timestamp
      },
    });

    revalidatePath("/dashboard/logbook");
    return { success: true };
  } catch (error) {
    console.error("Failed to commit logbook revision:", error);
    return { error: "Failed to sync changes to database." };
  }
}
