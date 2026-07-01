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

    // 💡 Clean, native Upsert using our new unique constraints
    await prisma.documentSubmission.upsert({
      where: {
        studentId_taskName: {
          studentId: studentProfile.id,
          taskName: taskName,
        },
      },
      update: {
        fileUrl,
        isCompleted: true,
        status: "PENDING", // Reset back to pending loop upon re-upload
        feedback: null, // Wipe previous rejection notes
        reviewedAt: null, // Reset audit timestamp
      },
      create: {
        studentId: studentProfile.id,
        taskName,
        fileUrl,
        isCompleted: true,
        status: "PENDING",
      },
    });

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
    return { error: "Security Exception: Unauthorized document modification." };
  }

  const taskName = formData.get("taskName") as string;

  try {
    const studentProfile = await prisma.studentProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!studentProfile) {
      return {
        error: "Student tracking profile configuration parameters missing.",
      };
    }

    await prisma.documentSubmission.delete({
      where: {
        studentId_taskName: {
          studentId: studentProfile.id,
          taskName: taskName,
        },
      },
    });

    revalidatePath("/dashboard/documents");
    return { success: true };
  } catch (error) {
    console.error("Failed to delete document entry:", error);
    return { error: "Failed to erase document record from database storage." };
  }
}
