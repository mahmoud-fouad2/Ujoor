/**
 * Documents API Routes with R2 Upload
 */

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { r2Client, R2_BUCKET_NAME } from "@/lib/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { DocumentCategory } from "@prisma/client";

function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");
    const category = searchParams.get("category");

    const where: any = {};
    
    if (tenantId) {
      where.tenantId = tenantId;
    }
    
    if (employeeId) {
      where.employeeId = employeeId;
    }
    
    if (category) {
      where.category = category;
    }

    const documents = await prisma.document.findMany({
      where,
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            employeeNumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ data: documents });
  } catch (error) {
    console.error("Error fetching documents:", error);
    return NextResponse.json(
      { error: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tenantId = session.user.tenantId;
    const userId = session.user.id;
    
    if (!tenantId) {
      return NextResponse.json({ error: "Tenant required" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;
    const employeeId = formData.get("employeeId") as string;
    const title = formData.get("title") as string;
    const titleAr = formData.get("titleAr") as string | null;
    const category = formData.get("category") as DocumentCategory;
    const description = formData.get("description") as string | null;
    const expiryDate = formData.get("expiryDate") as string | null;

    if (!file || !employeeId || !title || !category) {
      return NextResponse.json(
        { error: "File, employee, title, and category are required" },
        { status: 400 }
      );
    }

    // Generate unique file key
    const fileExt = file.name.split(".").pop();
    const fileKey = `documents/${tenantId}/${employeeId}/${generateId()}.${fileExt}`;

    // Upload to R2
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    await r2Client.send(
      new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileKey,
        Body: buffer,
        ContentType: file.type,
      })
    );

    // Get public URL
    const publicUrl = process.env.R2_PUBLIC_URL;
    const fileUrl = `${publicUrl}/${fileKey}`;

    // Create document record
    const document = await prisma.document.create({
      data: {
        tenantId,
        employeeId,
        uploadedById: userId,
        fileName: fileKey,
        originalName: file.name,
        mimeType: file.type,
        size: file.size,
        url: fileUrl,
        title,
        titleAr,
        category,
        description,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        status: "PENDING",
      },
      include: {
        employee: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    return NextResponse.json({ data: document }, { status: 201 });
  } catch (error) {
    console.error("Error uploading document:", error);
    return NextResponse.json(
      { error: "Failed to upload document" },
      { status: 500 }
    );
  }
}
