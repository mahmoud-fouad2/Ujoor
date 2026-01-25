import { promises as fs } from "fs";
import path from "path";
import { Metadata } from "next";
import { generateMeta } from "@/lib/utils";
import { getAppLocale } from "@/lib/i18n/locale";
import { getText } from "@/lib/i18n/text";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import UsersDataTable from "./data-table";
import { Card, CardContent } from "@/components/ui/card";

export async function generateMetadata(): Promise<Metadata>{
  const locale = await getAppLocale();
  return generateMeta({
    title: locale === "ar" ? "المستخدمون" : "Users",
    description:
      locale === "ar"
        ? "قائمة المستخدمين وإدارتهم."
        : "Users list and management.",
  });
}

async function getUsers() {
  const data = await fs.readFile(path.join(process.cwd(), "app/dashboard/users/data.json"));
  return JSON.parse(data.toString());
}

export default async function Page() {
  const locale = await getAppLocale();
  const t = getText(locale);
  const users = await getUsers();

  return (
    <>
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight">{locale === "ar" ? "المستخدمون" : "Users"}</h1>
        <Button variant="secondary" asChild>
          <Link href="#" aria-disabled>
            <PlusCircledIcon /> {locale === "ar" ? "إضافة مستخدم" : "Add user"} ({t.common.coming})
          </Link>
        </Button>
      </div>
      <Card>
        <CardContent>
          <UsersDataTable data={users} />
        </CardContent>
      </Card>
    </>
  );
}
