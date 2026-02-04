import SwaggerUi from "./swagger-ui";

export const metadata = {
  title: "Swagger UI",
};

export default function SwaggerPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto w-full max-w-6xl p-6">
        <div className="mb-4 space-y-1">
          <h1 className="text-2xl font-semibold">Swagger UI</h1>
          <p className="text-sm text-muted-foreground">Powered by /api/openapi</p>
        </div>
        <div className="rounded-md border bg-card p-2">
          <SwaggerUi />
        </div>
      </div>
    </div>
  );
}
