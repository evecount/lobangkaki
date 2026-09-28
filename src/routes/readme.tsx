import { createFileRoute, Link } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowLeft, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import readme from "../../README.md?raw";

export const Route = createFileRoute("/readme")({
  head: () => ({ meta: [
    { title: "Project README — LobangKaki (甘榜通)" },
    { name: "description", content: "Read the complete LobangKaki hackathon project README: mission, community trust model, features, architecture, and quick start." },
    { property: "og:title", content: "Project README — LobangKaki" },
    { property: "og:description", content: "The complete LobangKaki project README, available to read in the app." },
    { property: "og:type", content: "article" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: ReadmePage,
});

function ReadmePage() {
  return <main className="min-h-screen bg-background text-foreground">
    <nav className="border-b border-border px-5 py-4" aria-label="Project navigation"><div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3"><Link to="/" className="font-display text-xl font-bold text-primary">LobangKaki 甘榜通</Link><div className="flex gap-2"><Button asChild variant="outline"><Link to="/"><ArrowLeft /> Live demo</Link></Button><Button asChild><Link to="/pitch" search={{ slide: 1 }}><Presentation /> Pitch deck</Link></Button></div></div></nav>
    <div className="mx-auto max-w-5xl px-5 py-10 sm:py-16"><p className="mb-4 text-sm font-extrabold uppercase text-primary">THE COMPLETE PROJECT README</p><article className="readme-content min-w-0 max-w-none"><ReactMarkdown remarkPlugins={[remarkGfm]} components={{ table: ({ children }) => <div className="readme-table-scroll"><table>{children}</table></div> }}>{readme}</ReactMarkdown></article><p className="mt-10 border-t border-border pt-5 text-sm text-muted-foreground">This is the complete supplied project document. Some statements describe the project vision rather than connected production capabilities; the live demo is a local, client-side simulation.</p></div>
  </main>;
}