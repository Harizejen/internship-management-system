"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewLogbookEntryAction(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;

  if (
    !session?.user ||
    (role !== "ACADEMIC_SUPERVISOR" &&
      role !== "ORGANIZATION_SUPERVISOR" &&
      role !== "ADMIN")
  ) {
    return {
      error: "Security exception: Unauthorized administrative operation.",
    };
  }

  const entryId = formData.get("entryId") as string;
  const feedback = formData.get("feedback") as string;
  const actionType = formData.get("actionType") as "APPROVE" | "REJECT";

  if (!entryId) {
    return { error: "Target logbook entry ID token is missing." };
  }

  try {
    const isApproved = actionType === "APPROVE";
    const timestamp = isApproved ? new Date() : null;

    // Build operational update matrix based on whether the supervisor is Industry or Faculty
    let updateData: any = {};

    if (role === "ORGANIZATION_SUPERVISOR" || role === "ADMIN") {
      updateData.orgApproved = isApproved;
      updateData.orgFeedback = feedback || null;
      updateData.orgApprovedAt = timestamp;
    }

    if (role === "ACADEMIC_SUPERVISOR" || role === "ADMIN") {
      updateData.acadApproved = isApproved;
      updateData.acadFeedback = feedback || null;
      updateData.acadApprovedAt = timestamp;
    }

    // Update row parameters inside Supabase
    await prisma.logbookEntry.update({
      where: { id: entryId },
      data: updateData,
    });

    revalidatePath("/dashboard/review");
    return { success: true };
  } catch (error) {
    console.error("Supervisor approval operation failure:", error);
    return {
      error: "Failed to commit verification state to Supabase cluster.",
    };
  }
}
