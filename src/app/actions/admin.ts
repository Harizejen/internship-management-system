"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function assignAcademicSupervisorAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "Security Exception: Restriced Administrator operation." };
  }

  const studentProfileId = formData.get("studentProfileId") as string;
  const supervisorId = formData.get("supervisorId") as string;

  if (!studentProfileId) {
    return { error: "Target student reference missing." };
  }

  try {
    // Update the relation mapping inside the StudentProfile table in Supabase
    await prisma.studentProfile.update({
      where: { id: studentProfileId },
      data: {
        // If the supervisorId is an empty string (e.g. "Unassigned"), set it to null
        academicSupervisorId:
          supervisorId === "unassigned" ? null : supervisorId,
      },
    });

    revalidatePath("/dashboard/admin");
    return { success: true };
  } catch (error) {
    console.error("Failed to map academic supervisor assignment:", error);
    return {
      error: "Failed to sync relationship changes to cloud cluster database.",
    };
  }
}
