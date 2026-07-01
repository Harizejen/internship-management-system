"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function submitDocumentAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return { error: "Security Exception: Unauthorized document submission." };
  }

  const taskName = formData.get("taskName") as string;
  const fileUrl = formData.get("fileUrl") as string;

  if (!taskName || !fileUrl) {
    return { error: "Missing required file reference arguments." };
  }

  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return {
        error: "Student tracking profile configuration parameters missing.",
      };
    }

    // 💡 THE CURE FOR DUPLICATE ROWS: Check if this file asset row already exists
    const existingSubmission = await prisma.documentSubmission.findFirst({
      where: {
        studentId: studentProfile.id,
        taskName: taskName,
      },
    });

    if (existingSubmission) {
      // If it exists, overwrite the old URL reference string with the new one
      await prisma.documentSubmission.update({
        where: { id: existingSubmission.id },
        data: { fileUrl },
      });
    } else {
      // If it's a completely fresh upload, create the record row normally
      await prisma.documentSubmission.create({
        data: {
          studentId: studentProfile.id,
          taskName,
          fileUrl,
          isCompleted: true,
        },
      });
    }

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Failed to map cloud file token:", error);
    return {
      error: "Failed to sync file tracking updates to database storage arrays.",
    };
  }
}

export async function deleteDocumentAction(formData: FormData) {
  const session = await auth();

  if (!session?.user || session.user.role !== "STUDENT") {
    return {
      error:
        "Security Exception: Unauthorized document modification parameters.",
    };
  }

  const taskName = formData.get("taskName") as string;

  if (!taskName) {
    return { error: "Target task identification token is missing." };
  }

  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return {
        error: "Student tracking profile configuration parameters missing.",
      };
    }

    // Locate the matching row vector and wipe it from the schema collection
    const targetRow = await prisma.documentSubmission.findFirst({
      where: {
        studentId: studentProfile.id,
        taskName: taskName,
      },
    });

    if (targetRow) {
      await prisma.documentSubmission.delete({
        where: { id: targetRow.id },
      });
    }

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete document entry:", error);
    return { error: "Failed to erase document record from database storage." };
  }
}
