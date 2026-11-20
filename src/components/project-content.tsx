import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, CloudRain, Droplets, Filter, Waves, Leaf, Camera, Maximize2, Menu, X, Cpu, Radio, Container, Gauge, Sprout, Check, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RainSimulation } from "@/components/rain-simulation";

export const photos = [
  { src: "/fotos/maquete-visao-geral.jpg", title: "A maquete completa", description: "Visão geral da casa e do reservatório.", alt: "Vista frontal da maquete com casa, jardim e reservatório elevado" },
  { src: "/fotos/maquete-telhado.jpg", title: "Cada detalhe conta", description: "Construção da casa e o telhado com placa solar.", alt: "Casa da maquete com telhado amarelo e uma pequena placa solar" },
  { src: "/fotos/maquete-reservatorios.jpg", title: "O sistema em detalhe", description: "Reservatórios, sensores e bomba hidráulica.", alt: "Reservatórios transparentes, sensores ultrassônicos e bomba ao lado da casa" },
  { src: "/fotos/maquete-eletronica.jpg", title: "Tecnologia por dentro", description: "Arduino e conexões no interior da maquete.", alt: "Interior da maquete com placa Arduino Uno, protoboard, relé e conexões" },
  { src: "/fotos/maquete-caixa-elevada.jpg", title: "Reservatório elevado", description: "Caixa d'água sobre a estrutura de madeira, com sensor de nível.", alt: "Reservatório transparente sobre estrutura de madeira ao lado da casa, com sensor ultrassônico" },
  { src: "/fotos/maquete-casa-aberta.jpg", title: "Casa aberta", description: "A eletrônica escondida dentro da casa, ao lado do jardim.", alt: "Casa da maquete aberta mostrando o Arduino e a protoboard, com o gramado ao lado" },
] as const;

const navigation = [
  { to: "/", label: "Início" }, { to: "/projeto", label: "O projeto" }, { to: "/funcionamento", label: "Como funciona" }, { to: "/componentes", label: "Componentes" }, { to: "/galeria", label: "Galeria" }, { to: "/sustentabilidade", label: "Sustentabilidade" },
] as const;

export const steps = [
  { icon: CloudRain, title: "Captação", short: "Tudo começa com a chuva", description: "A água da chuva é recolhida pelo telhado e direcionada por calhas e tubulações até o sistema de filtragem." },
  { icon: Filter, title: "Filtragem", short: "Um novo caminho para a água", description: "A água passa por camadas de materiais, como pedras, areia e carvão ativado, que ajudam a reter impurezas." },
  { icon: Container, title: "Armazenamento", short: "Cada gota tem seu lugar", description: "Após a filtragem, a água é direcionada a um reservatório, onde fica armazenada para ser reaproveitada." },
  { icon: Droplets, title: "Reutilização", short: "Mais usos, menos desperdício", description: "A água armazenada pode ser utilizada em atividades que não exigem água potável, como regar plantas e limpar áreas externas." },
];

export function projectHead(title: string, description: string) {
  return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
}

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return <header className="site-header"><div className="site-container header-inner"><Link to="/" className="brand" aria-label="Água da chuva — início"><Droplets className="brand-icon" /><span>Água da chuva<small>TECNOLOGIA A FAVOR DA NATUREZA</small></span></Link><nav className="desktop-nav" aria-label="Navegação principal">{navigation.map(item => <Link key={item.to} to={item.to} className="nav-link" activeOptions={{ exact: true }}>{item.label}</Link>)}</nav><Button variant="ghost" size="icon" className="mobile-menu-button" aria-label={open ? "Fechar menu" : "Abrir menu"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <Menu />}</Button></div>{open && <nav className="mobile-nav" aria-label="Navegação no celular">{navigation.map(item => <Link key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</Link>)}</nav>}</header>;
}

export function SiteFooter() {
  return <footer className="site-footer"><div className="site-container"><div className="footer-top"><div><Link to="/" className="brand"><Droplets className="brand-icon" /><span>Água da chuva</span></Link><p className="mt-4">Reutilização da Água da Chuva<br />Um projeto escolar de tecnologia e sustentabilidade.</p></div><div><h3>INTEGRANTES</h3><p>Guilherme Machado Segovia<br />Micaeli Alves de Sa<br />Mariane Correia Ferreira</p></div><div><h3>INSTITUIÇÃO DE ENSINO</h3><p>Escola Técnica Adélia</p></div></div><div className="footer-bottom"><span>Reutilização da Água da Chuva · Projeto escolar</span><span><Leaf size={13} /> Cuidar da água é cuidar do amanhã.</span></div></div></footer>;
}

export function PageIntro({ label, title, description }: { label: string; title: string; description: string }) {
  return <section className="page-intro"><div className="site-container"><div className="eyebrow section-label"><span className="eyebrow-dot" />{label}</div><h1>{title}</h1><p>{description}</p></div></section>;
}

export function HomeHero() {
  return <section className="hero"><img className="hero-photo" src={photos[0].src} alt={photos[0].alt} fetchPriority="high" /><div className="site-container hero-inner"><div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />PROJETO ESCOLAR · TECNOLOGIA & SUSTENTABILIDADE</div><h1>Reutilização da<br />Água da <span>Chuva</span></h1><p className="hero-description">Uma maquete, uma ideia e um futuro mais sustentável. Conheça nosso projeto de captação, filtragem e reaproveitamento da água da chuva.</p><div className="hero-actions"><Button asChild variant="hero" size="lg"><Link to="/funcionamento">Conheça o funcionamento <ArrowRight /></Link></Button><Button asChild variant="heroLink"><Link to="/galeria">Explore a maquete <ArrowUpRight /></Link></Button></div></div></div><div className="hero-note"><Camera size={13} /> Fotografia real do nosso projeto</div></section>;
}

export function ProcessRibbon() {
  return <div className="process-ribbon"><div className="site-container ribbon-grid">{steps.map(step => <div className="ribbon-item" key={step.title}><step.icon /><div><strong>{step.title}</strong><small>{step.short}</small></div></div>)}</div></div>;
}

export function AboutSection({ full = false }: { full?: boolean }) {
  return <div className="about-grid"><div><div className="eyebrow section-label"><span className="eyebrow-dot" />UMA IDEIA QUE FAZ A DIFERENÇA</div><h2>Pequena na escala.<br />Grande no propósito.</h2><p>Nosso projeto transforma uma maquete em uma demonstração de como a água da chuva pode ganhar um novo destino.</p><p>Unindo tecnologia, eletrônica e consciência ambiental, apresentamos uma solução para captar, filtrar, armazenar e reutilizar um recurso essencial à vida.</p>{full ? <ul className="objective-list">{["Reduzir o desperdício de água potável.", "Incentivar o reaproveitamento de recursos naturais.", "Demonstrar alternativas sustentáveis para o consumo de água.", "Aplicar conhecimentos de tecnologia, eletrônica e sustentabilidade."].map(text => <li key={text}><Check />{text}</li>)}</ul> : <><div className="value-tags"><span><Leaf size={15} /> Sustentabilidade</span><span><Cpu size={15} /> Tecnologia</span></div><Button asChild variant="link" className="p-0"><Link to="/projeto">Conheça o projeto <ArrowRight /></Link></Button></>}</div><figure className="m-0"><img className="about-photo" src={photos[1].src} alt={photos[1].alt} loading="lazy" /><figcaption className="photo-caption"><Camera size={12} /> Nossa maquete: criatividade e aprendizado na prática.</figcaption></figure></div>;
}

export function Gallery({ full = false }: { full?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const current = selected === null ? undefined : photos[selected];
  const move = (direction: number) => setSelected(value => value === null ? null : (value + direction + photos.length) % photos.length);
  return <div className={full ? "gallery-full" : ""}><div className="gallery-grid">{photos.map((photo, i) => <article key={photo.src} className="gallery-item"><Button variant="ghost" className="gallery-button" aria-label={`Ampliar: ${photo.title}`} onClick={() => setSelected(i)}><img src={photo.src} alt={photo.alt} loading="lazy" /><span className="gallery-zoom"><Maximize2 size={14} /></span></Button><h3>{photo.title}</h3><p>{photo.description}</p></article>)}</div><DialogPrimitive.Root open={selected !== null} onOpenChange={open => { if (!open) setSelected(null); }}><DialogPrimitive.Portal><DialogPrimitive.Overlay className="lightbox-overlay" /><DialogPrimitive.Content className="lightbox-content" aria-describedby={undefined} onKeyDown={event => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }}><DialogPrimitive.Close asChild><Button variant="lightbox" size="icon" className="lightbox-close" aria-label="Fechar fotografia"><X /></Button></DialogPrimitive.Close>{current && <><img src={current.src} alt={current.alt} /><DialogPrimitive.Title className="lightbox-title">{current.title}</DialogPrimitive.Title><div className="lightbox-controls"><Button variant="lightbox" size="icon" aria-label="Fotografia anterior" onClick={() => move(-1)}><ChevronLeft /></Button><span className="lightbox-count">{selected === null ? "" : selected + 1} / {photos.length}</span><Button variant="lightbox" size="icon" aria-label="Próxima fotografia" onClick={() => move(1)}><ChevronRight /></Button></div></>}</DialogPrimitive.Content></DialogPrimitive.Portal></DialogPrimitive.Root></div>;
}

export function SustainabilityBand() {
  return <section className="section sustainability-band"><div className="site-container sustainability-inner"><div><div className="eyebrow section-label"><span className="eyebrow-dot" />O FUTURO COMEÇA COM PEQUENAS ATITUDES</div><h2>Cada gota reaproveitada.<br />Um passo para o amanhã.</h2><p>Reutilizar a água da chuva é repensar nossa relação com a natureza. Pequenas soluções podem inspirar grandes mudanças.</p><Button asChild variant="link" className="px-0 mt-4"><Link to="/sustentabilidade">Por que isso importa <ArrowRight /></Link></Button></div><Sprout className="sustainability-icon" /></div></section>;
}

export function FunctioningContent() {
  return <><div className="steps-grid">{steps.map((step, i) => <article className="step" key={step.title}><div className="step-top"><step.icon size={38} strokeWidth={1.5} /><span>0{i + 1}</span></div><h2>{step.title}</h2><p>{step.description}</p></article>)}</div><RainSimulation /><div className="water-notice"><Info size={21} /><span>A filtragem apresentada não torna a água potável. O reaproveitamento é destinado a atividades que não exigem água para consumo humano.</span></div><figure className="m-0 mt-10"><img src={photos[2].src} alt={photos[2].alt} className="about-photo" loading="lazy" /><figcaption className="photo-caption"><Camera size={12} /> Reservatórios e componentes do sistema na maquete.</figcaption></figure></>;
}

const materials: { icon: typeof Cpu; name: string; text: string; photo?: { src: string; alt: string } }[] = [
  { icon: Cpu, name: "Arduino", text: "Placa utilizada na organização e no controle dos componentes eletrônicos da maquete.", photo: photos[3] },
  { icon: Radio, name: "Sensores ultrassônicos de nível", text: "Sensores destinados à leitura do nível de água nos reservatórios.", photo: photos[2] },
  { icon: Container, name: "Reservatórios de água", text: "Recipientes que recebem e armazenam a água durante a demonstração.", photo: photos[4] },
  { icon: Gauge, name: "Bombas hidráulicas", text: "Componentes responsáveis pela movimentação da água no sistema.", photo: photos[2] },
  { icon: Waves, name: "Tubulações transparentes", text: "Mangueiras de silicone transparentes que conduzem a água entre as etapas e permitem observar seu percurso.", photo: { src: "/fotos/mangueira-silicone.jpg", alt: "Mangueira de silicone transparente Soma MS-3M, com 3 metros de comprimento, enrolada" } },
];

export function ComponentsContent() {
  return <div className="components-grid">{materials.map(material => <article className="component-item" key={material.name}><figure className="component-image-slot">{material.photo ? <img src={material.photo.src} alt={`${material.name}: ${material.photo.alt}`} loading="lazy" /> : <div className="component-image-pending" aria-label={`Fotografia de ${material.name} ainda não enviada`}><material.icon aria-hidden="true" /><span>Fotografia em breve</span></div>}</figure><div className="component-description"><material.icon /><h2>{material.name}</h2><p>{material.text}</p></div></article>)}</div>;
}

export function SustainabilityContent() {
  return <div className="section"><div className="about-grid"><div><div className="eyebrow section-label"><Leaf size={15} />RESPONSABILIDADE AMBIENTAL</div><h2>A água é um recurso.<br />Cuidar é uma escolha.</h2><p>A água potável é essencial para a vida, mas nem todas as atividades do dia a dia precisam dela. Aproveitar a água da chuva para usos não potáveis ajuda a evitar desperdícios e a valorizar os recursos naturais.</p><p>Nossa maquete aproxima essa ideia da realidade: um projeto escolar que conecta aprendizado, criatividade e responsabilidade ambiental.</p><ul className="objective-list"><li><Check />Valorizar cada recurso que a natureza oferece.</li><li><Check />Repensar o consumo de água no cotidiano.</li><li><Check />Inspirar soluções sustentáveis a partir da educação.</li></ul></div><figure className="m-0"><img className="about-photo" src={photos[0].src} alt={photos[0].alt} loading="lazy" /><figcaption className="photo-caption"><Sprout size={13} /> Um aprendizado que pode ir além da sala de aula.</figcaption></figure></div></div>;
}