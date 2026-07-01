"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updatePlacementDetailsAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return {
      error:
        "Security Exception: Unauthenticated student context operations blocked.",
    };
  }

  const userId = session.user.id;

  // Extract Form Fields
  const organizationName = formData.get("organizationName") as string;
  const startDateInput = formData.get("startDate") as string;
  const endDateInput = formData.get("endDate") as string;
  const mentorName = formData.get("mentorName") as string;
  const mentorEmail = formData.get("mentorEmail") as string;

  if (!organizationName || !mentorEmail || !mentorName) {
    return { error: "Missing required placement fields." };
  }

  try {
    // 1. Process or Upsert the Industry Mentor Account Profile
    let mentor = await prisma.user.findUnique({
      where: { email: mentorEmail.toLowerCase().trim() },
    });

    if (!mentor) {
      // Create fresh user account pre-configured with the Organization role flag
      mentor = await prisma.user.create({
        data: {
          name: mentorName.trim(),
          email: mentorEmail.toLowerCase().trim(),
          role: "ORGANIZATION_SUPERVISOR",
        },
      });
    } else if (mentor.role === "STUDENT") {
      return {
        error:
          "Conflict: This email is already registered to a student account.",
      };
    } else if (
      mentor.role === "ADMIN" ||
      mentor.role === "ACADEMIC_SUPERVISOR"
    ) {
      // Upgrading existing university profiles if needed, or simply reusing them
    } else {
      // Existing mentor found, synchronize their name if it was blank
      if (!mentor.name) {
        await prisma.user.update({
          where: { id: mentor.id },
          data: { name: mentorName.trim() },
        });
      }
    }

    // 2. Commit updates directly to the active Student Profile row
    await prisma.studentProfile.update({
      where: { userId },
      data: {
        organizationName: organizationName.trim(),
        startDate: startDateInput ? new Date(startDateInput) : null,
        endDate: endDateInput ? new Date(endDateInput) : null,
        orgSupervisorId: mentor.id, // Bind the relational foreign key link!
        status: "ONGOING", // Pivot status flag from PENDING to active
      },
    });

    revalidatePath("/dashboard/placement");
    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Failed to commit placement updates:", error);
    return {
      error:
        "Internal cluster write exception occurred while compiling parameters.",
    };
  }
}
