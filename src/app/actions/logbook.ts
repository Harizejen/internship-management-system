"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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

    // Write structural entry matching the exact Prisma schema columns
    await prisma.logbookEntry.create({
      data: {
        studentId: studentProfile.id,
        date: new Date(dateStr),
        weekNumber,
        activityDetails,
        hoursWorked,
        // orgApproved and acadApproved automatically default to false via database layer
      },
    });

    revalidatePath("/dashboard/logbook");
    return { success: true };
  } catch (error: any) {
    console.error("Logbook entry creation failure:", error);
    // Handle the unique constraint catch if a student tries logging the same date twice
    if (error?.code === "P2002") {
      return {
        error: "You have already committed a log entry for this specific date.",
      };
    }
    return { error: "Failed to synchronize entry to cloud cluster database." };
  }
}
