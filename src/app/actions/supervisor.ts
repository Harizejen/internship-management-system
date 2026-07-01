"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function reviewDocumentAction(formData: FormData) {
  const session = await auth();
  const role = session?.user?.role;

  if (
    !session?.user ||
    (role !== "ACADEMIC_SUPERVISOR" &&
      role !== "ORGANIZATION_SUPERVISOR" &&
      role !== "ADMIN")
  ) {
    return { error: "Security Exception: Unauthorized evaluation operations." };
  }

  const submissionId = formData.get("submissionId") as string;
  const actionType = formData.get("actionType") as "APPROVE" | "REJECT";
  const feedbackText = formData.get("feedback") as string;

  if (!submissionId || !actionType) {
    return { error: "Missing required tracking tokens for review completion." };
  }

  try {
    if (actionType === "APPROVE") {
      await prisma.documentSubmission.update({
        where: { id: submissionId },
        data: {
          status: "APPROVED",
          feedback: null, // Clear out past complaints on success
          reviewedAt: new Date(),
        },
      });
    } else {
      await prisma.documentSubmission.update({
        where: { id: submissionId },
        data: {
          status: "REJECTED",
          feedback:
            feedbackText || "Document rejected. Please re-upload a valid file.",
          reviewedAt: new Date(),
        },
      });
    }

    revalidatePath("/dashboard/supervisor/documents");
    // Also revalidate the student view path context
    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Supervisor evaluation failure:", error);
    return {
      error: "Failed to update document verification records inside database.",
    };
  }
}
