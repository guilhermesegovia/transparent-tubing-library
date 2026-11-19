import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HomeHero, ProcessRibbon, AboutSection, Gallery, SustainabilityBand, projectHead } from "@/components/project-content";

// The home route ships no og:image, so serve-time hosting can inject the
// project's social preview (explicit og:image or latest screenshot).
export const Route = createFileRoute("/")({
  head: () => projectHead("Reutilização da Água da Chuva | Escola Técnica Adélia", "Conheça a maquete escolar de captação, filtragem e reutilização da água da chuva. Tecnologia, criatividade e sustentabilidade na Escola Técnica Adélia."),
  component: Index,
});

// IMPORTANT: Replace this placeholder. See ./README.md for routing conventions.
function Index() {
  return <main><HomeHero /><ProcessRibbon /><section className="section"><div className="site-container"><AboutSection /></div></section><section className="section gallery-section"><div className="site-container"><div className="section-top"><div><div className="eyebrow section-label"><span className="eyebrow-dot" />DO PAPEL À REALIDADE</div><h2>Nosso projeto, de perto.</h2></div><Button asChild variant="link" className="px-0"><Link to="/galeria">Ver galeria completa <ArrowRight /></Link></Button></div><Gallery /></div></section><SustainabilityBand /></main>;
}
