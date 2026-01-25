/**
 * NextAuth Type Declarations
 * Extend default types with custom user properties
 */

import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      avatar: string | null;
      role: string;
      permissions: string[];
      tenantId: string | null;
      tenant: {
        id: string;
        name: string;
        nameAr: string | null;
        slug: string;
        status: string;
        plan: string;
      } | null;
      employee: {
        id: string;
        employeeNumber: string;
        firstName: string;
        lastName: string;
        firstNameAr: string | null;
        lastNameAr: string | null;
        avatar: string | null;
        departmentId: string | null;
        jobTitleId: string | null;
      } | null;
    };
  }

  interface User extends DefaultUser {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
    permissions: string[];
    tenantId: string | null;
    tenant: {
      id: string;
      name: string;
      nameAr: string | null;
      slug: string;
      status: string;
      plan: string;
    } | null;
    employee: {
      id: string;
      employeeNumber: string;
      firstName: string;
      lastName: string;
      firstNameAr: string | null;
      lastNameAr: string | null;
      avatar: string | null;
      departmentId: string | null;
      jobTitleId: string | null;
    } | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    avatar: string | null;
    role: string;
    permissions: string[];
    tenantId: string | null;
    tenant: {
      id: string;
      name: string;
      nameAr: string | null;
      slug: string;
      status: string;
      plan: string;
    } | null;
    employee: {
      id: string;
      employeeNumber: string;
      firstName: string;
      lastName: string;
      firstNameAr: string | null;
      lastNameAr: string | null;
      avatar: string | null;
      departmentId: string | null;
      jobTitleId: string | null;
    } | null;
  }
}
