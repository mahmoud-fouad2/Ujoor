import prisma from "@/lib/db";
import { isWithinRadiusMeters } from "@/lib/geo";
import type { CheckSource } from "@prisma/client";

export type SubmitAttendanceInput = {
  tenantId: string;
  employeeId: string;
  type: "check-in" | "check-out";
  source?: CheckSource;
  latitude?: number;
  longitude?: number;
  accuracy?: number;
  address?: string;
};

export async function submitAttendance(input: SubmitAttendanceInput) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: input.tenantId },
    select: { id: true },
  });

  if (!employee) {
    const err = new Error("Employee not found");
    // @ts-expect-error attach status
    err.status = 404;
    throw err;
  }

  const policy = await prisma.tenantAttendancePolicy.findUnique({
    where: { tenantId: input.tenantId },
  });

  const hasLocation = typeof input.latitude === "number" && typeof input.longitude === "number";

  let matchedLocationId: string | null = null;

  if (policy?.enforceGeofence) {
    if (!hasLocation) {
      if (!policy.allowCheckInWithoutLocation) {
        const err = new Error("Location is required for attendance");
        // @ts-expect-error attach status
        err.status = 400;
        throw err;
      }
    } else {
      if (typeof input.accuracy === "number" && input.accuracy > policy.maxAccuracyMeters) {
        const err = new Error("Location accuracy is too low");
        // @ts-expect-error attach status
        err.status = 400;
        throw err;
      }

      const locations = await prisma.tenantWorkLocation.findMany({
        where: { tenantId: input.tenantId, isActive: true },
        select: { id: true, lat: true, lng: true, radiusMeters: true },
      });

      if (locations.length === 0) {
        const err = new Error("No work locations configured");
        // @ts-expect-error attach status
        err.status = 400;
        throw err;
      }

      const point = { lat: input.latitude!, lng: input.longitude! };

      const match = locations.find((loc) =>
        isWithinRadiusMeters(
          point,
          { lat: Number(loc.lat), lng: Number(loc.lng) },
          loc.radiusMeters
        )
      );

      if (!match) {
        const err = new Error("Outside allowed work location");
        // @ts-expect-error attach status
        err.status = 403;
        throw err;
      }

      matchedLocationId = match.id;
    }
  }

  let record = await prisma.attendanceRecord.findFirst({
    where: {
      tenantId: input.tenantId,
      employeeId: input.employeeId,
      date: today,
    },
  });

  const source: CheckSource = input.source || "WEB";

  if (input.type === "check-in") {
    if (record && record.checkInTime) {
      const err = new Error("Already checked in today");
      // @ts-expect-error attach status
      err.status = 400;
      throw err;
    }

    if (record) {
      record = await prisma.attendanceRecord.update({
        where: { id: record.id },
        data: {
          checkInTime: now,
          checkInSource: source,
          checkInLat: input.latitude,
          checkInLng: input.longitude,
          checkInAddress: input.address,
          checkInLocationId: matchedLocationId,
          status: "PRESENT",
        },
      });
    } else {
      record = await prisma.attendanceRecord.create({
        data: {
          tenantId: input.tenantId,
          employeeId: input.employeeId,
          date: today,
          checkInTime: now,
          checkInSource: source,
          checkInLat: input.latitude,
          checkInLng: input.longitude,
          checkInAddress: input.address,
          checkInLocationId: matchedLocationId,
          status: "PRESENT",
        },
      });
    }
  } else {
    if (!record || !record.checkInTime) {
      const err = new Error("Must check in first");
      // @ts-expect-error attach status
      err.status = 400;
      throw err;
    }

    if (record.checkOutTime) {
      const err = new Error("Already checked out today");
      // @ts-expect-error attach status
      err.status = 400;
      throw err;
    }

    const checkInTime = new Date(record.checkInTime);
    const totalMinutes = Math.floor((now.getTime() - checkInTime.getTime()) / 60000);

    record = await prisma.attendanceRecord.update({
      where: { id: record.id },
      data: {
        checkOutTime: now,
        checkOutSource: source,
        checkOutLat: input.latitude,
        checkOutLng: input.longitude,
        checkOutAddress: input.address,
        checkOutLocationId: matchedLocationId,
        totalWorkMinutes: totalMinutes,
      },
    });
  }

  return record;
}
