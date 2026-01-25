import type { Metadata } from "next";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { JsonLd } from "@/components/marketing/json-ld";
import { faqSchema } from "@/lib/marketing/schema";
import { marketingMetadata } from "@/lib/marketing/seo";

export async function generateMetadata(): Promise<Metadata> {
  return marketingMetadata({
    path: "/faq",
    titleAr: "الأسئلة الشائعة | أجور",
    titleEn: "FAQ | Ujoors",
    descriptionAr: "إجابات على الأسئلة الشائعة حول أجور: التفعيل، التسعير، الدعم، والأمان.",
    descriptionEn: "Frequently asked questions about Ujoors: onboarding, pricing, support, and security.",
  });
}

const faqs = [
  {
    q: "هل أجور مناسب للشركات الصغيرة؟",
    a: "نعم. باقة الأساسية مصممة لتبدأ بسرعة، ومع الوقت تقدر تنتقل لباقات أكبر بدون فقد بيانات.",
  },
  {
    q: "هل يوجد دعم عربي؟",
    a: "نعم، الواجهة عربية/إنجليزية، والدعم الفني متاح حسب الباقة.",
  },
  {
    q: "هل النظام متعدد الشركات (Multi-tenant)؟",
    a: "نعم. كل شركة داخل بيئة منفصلة وآمنة، مع صلاحيات وأدوار.",
  },
  {
    q: "هل أقدر أطلب تخصيصات؟",
    a: "أكيد. باقة المؤسسات تشمل تكاملات وتخصيصات حسب احتياجك.",
  },
  {
    q: "كيف يتم تفعيل الحساب؟",
    a: "بنرتّب معاك demo، ثم نجهّز tenant لشركتك ونستورد البيانات لو احتجت.",
  },
];

export default function FaqPage() {
  return (
    <main className="bg-background">
      <section className="container mx-auto px-4 py-14">
        <JsonLd data={faqSchema(faqs)} />
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-3xl font-bold sm:text-4xl">الأسئلة الشائعة</h1>
          <p className="mt-3 text-muted-foreground">لو سؤالُك مش موجود، ابعتلنا من صفحة الدعم.</p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl rounded-xl border bg-background p-2">
          <Accordion type="single" collapsible>
            {faqs.map((f, idx) => (
              <AccordionItem key={f.q} value={`item-${idx}`}>
                <AccordionTrigger className="px-4">{f.q}</AccordionTrigger>
                <AccordionContent className="px-4 pb-4 text-muted-foreground">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>
    </main>
  );
}
