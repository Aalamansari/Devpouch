import Link from "next/link";
import {
  Braces,
  Code2,
  FileJson,
  FileSpreadsheet,
  Database,
  Zap,
  Shield,
  Globe,
  ArrowRight,
  Wrench,
} from "lucide-react";
import { AdBanner } from "@/components/ads/AdBanner";
import { JsonLd } from "@/components/seo/JsonLd";

const tools = [
  {
    name: "JSON Formatter",
    description: "Format, validate, and minify JSON with tree view and path copying",
    href: "/json-formatter",
    icon: Braces,
    gradient: "from-amber-500 to-orange-600",
    bgGlow: "group-hover:shadow-amber-500/20",
  },
  {
    name: "XML Formatter",
    description: "Pretty-print, validate XML, and convert to JSON instantly",
    href: "/xml-formatter",
    icon: Code2,
    gradient: "from-orange-500 to-red-600",
    bgGlow: "group-hover:shadow-orange-500/20",
  },
  {
    name: "YAML Validator",
    description: "Validate YAML syntax, detect pitfalls, and convert to/from JSON",
    href: "/yaml-validator",
    icon: FileJson,
    gradient: "from-emerald-500 to-teal-600",
    bgGlow: "group-hover:shadow-emerald-500/20",
  },
  {
    name: "CSV ↔ JSON",
    description: "Convert between CSV and JSON with delimiter and header options",
    href: "/csv-json-converter",
    icon: FileSpreadsheet,
    gradient: "from-blue-500 to-indigo-600",
    bgGlow: "group-hover:shadow-blue-500/20",
  },
  {
    name: "SQL Formatter",
    description: "Beautify SQL with multi-dialect support and keyword casing",
    href: "/sql-formatter",
    icon: Database,
    gradient: "from-purple-500 to-violet-600",
    bgGlow: "group-hover:shadow-purple-500/20",
  },
];

const features = [
  {
    icon: Zap,
    title: "Blazing Fast",
    description: "Sub-second processing for files up to 10 MB. All operations run instantly in your browser.",
  },
  {
    icon: Shield,
    title: "100% Private",
    description: "Zero data transmission. All processing happens client-side. Your data never leaves your browser.",
  },
  {
    icon: Globe,
    title: "Works Everywhere",
    description: "Responsive design works on desktop, tablet, and mobile. Dark mode included.",
  },
];

const faqs = [
  {
    question: "Is Devpouch really free to use?",
    answer: "Yes, Devpouch is 100% free with no sign-up, no usage limits, and no hidden fees. All tools are available instantly in your browser.",
  },
  {
    question: "Is my data safe when using Devpouch?",
    answer: "Absolutely. All data processing happens entirely in your browser using JavaScript. Your data is never sent to any server. There is zero data transmission — we cannot see, store, or access your data.",
  },
  {
    question: "What formats does Devpouch support?",
    answer: "Devpouch supports JSON (format, validate, minify), XML (format, validate, convert to JSON), YAML (validate, convert to/from JSON), CSV (convert to/from JSON with custom delimiters), and SQL (format with multi-dialect support including MySQL, PostgreSQL, T-SQL, Oracle, and SQLite).",
  },
  {
    question: "Do I need to install anything?",
    answer: "No installation required. Devpouch runs entirely in your web browser. Just open the website and start formatting. It works on desktop, tablet, and mobile.",
  },
  {
    question: "Can I use Devpouch offline?",
    answer: "Devpouch requires an initial page load, but since all processing is client-side, you can continue using the tools even with an intermittent connection once the page is loaded.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <JsonLd data={faqJsonLd} />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-gradient-to-b from-primary/10 to-transparent rounded-full blur-3xl opacity-50" />
        <div className="relative mx-auto max-w-screen-xl px-4 py-20 md:py-32 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
            <Wrench className="h-3.5 w-3.5" />
            Free & Open Developer Tools
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-foreground via-foreground to-muted-foreground bg-clip-text text-transparent">
              Developer Data Tools,
            </span>
            <br />
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              All in One Place
            </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed">
            Format, validate, and convert JSON, XML, YAML, CSV, and SQL — all client-side.
            No installs, no data transmission, no sign-up required.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/json-formatter"
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-accent px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tool Cards */}
      <section className="mx-auto max-w-screen-xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Five Essential Tools
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Everything you need for everyday data formatting and validation tasks
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`group relative flex flex-col gap-4 rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${tool.bgGlow}`}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} shadow-lg`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">
                    {tool.name}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {tool.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                  Open tool <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Ad placement between sections */}
      <div className="mx-auto max-w-screen-xl px-4 py-4">
        <AdBanner slot="home-mid" format="horizontal" />
      </div>

      {/* Features */}
      <section className="mx-auto max-w-screen-xl px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center md:text-left">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="mx-auto max-w-screen-xl px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Common questions about Devpouch developer tools
          </p>
        </div>
        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.question}
              className="group rounded-xl border border-border bg-card p-4 transition-all"
            >
              <summary className="flex cursor-pointer items-center justify-between text-sm font-semibold list-none">
                {faq.question}
                <span className="ml-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180">
                  &#9662;
                </span>
              </summary>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Bottom ad */}
      <div className="mx-auto max-w-screen-xl px-4 py-4">
        <AdBanner slot="home-bottom" format="horizontal" />
      </div>
    </div>
  );
}
