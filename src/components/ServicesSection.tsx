"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Building2, TrendingUp, Scale, Users2, FileText, Brain } from "lucide-react";

if (typeof window !== "undefined") gsap.registerPlugin(ScrollTrigger);

type ServiceItem = { id: string; title: string; description: string; icon: React.ComponentType<{ className?: string }>; tag: string };
const SERVICES: ServiceItem[] = [
  { id: "01", title: "Virtual CFO", description: "Full financial stewardship — cash flow, forecasting, board-ready reporting, and strategic guidance.", icon: Building2, tag: "CAPITAL STEWARDSHIP" },
  { id: "02", title: "Financial Strategy", description: "Capital planning, unit economics, and long-horizon decisions built on evidence, not instinct.", icon: TrendingUp, tag: "UNIT ECONOMICS" },
  { id: "03", title: "Tax & Compliance", description: "Proactive tax planning and end-to-end compliance so surprises never become setbacks.", icon: Scale, tag: "STATUTORY GOVERNANCE" },
  { id: "04", title: "HR & Payroll", description: "People operations handled with precision — payroll, policy, and structure that scale.", icon: Users2, tag: "TALENT ARCHITECTURE" },
  { id: "05", title: "MIS & Reporting", description: "Dashboards and monthly reviews that turn raw data into decisions leadership can act on.", icon: FileText, tag: "EXECUTIVE INTELLIGENCE" },
  { id: "06", title: "Business Intelligence", description: "AI-assisted analysis that surfaces the questions worth asking — and the answers worth acting on.", icon: Brain, tag: "SYNTHETIC COGNITION" },
];
type Point = { x: number; y: number };

function circuitPath(points: Point[], radius = 18) {
  if (points.length < 2) return "";
  const result = [`M ${points[0].x} ${points[0].y}`];
  for (let i = 1; i < points.length - 1; i += 1) {
    const a = points[i - 1], b = points[i], c = points[i + 1];
    const ab = Math.hypot(b.x - a.x, b.y - a.y) || 1, bc = Math.hypot(c.x - b.x, c.y - b.y) || 1, r = Math.min(radius, ab * .4, bc * .4);
    const before = { x: b.x - ((b.x - a.x) / ab) * r, y: b.y - ((b.y - a.y) / ab) * r };
    const after = { x: b.x + ((c.x - b.x) / bc) * r, y: b.y + ((c.y - b.y) / bc) * r };
    result.push(`L ${before.x} ${before.y}`, `Q ${b.x} ${b.y} ${after.x} ${after.y}`);
  }
  const last = points[points.length - 1]; result.push(`L ${last.x} ${last.y}`); return result.join(" ");
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null), stageRef = useRef<HTMLDivElement>(null), gridRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLElement | null)[]>([]), pathRef = useRef<SVGPathElement>(null), activePathRef = useRef<SVGPathElement>(null), trackerRef = useRef<SVGGElement>(null);
  const connectionRefs = useRef<(SVGGElement | null)[]>([]), headingRef = useRef<HTMLDivElement>(null), introRef = useRef<HTMLParagraphElement>(null);
  const activeIndexRef = useRef(-1);
  const [activeIndex, setActiveIndex] = useState(-1);

  const buildPath = useCallback(() => {
    const grid = gridRef.current, cards = cardsRef.current;
    if (!grid || cards.length !== 6 || cards.some((card) => !card)) return null;
    const box = grid.getBoundingClientRect();
    const c = cards.map((card) => { const r = card!.getBoundingClientRect(); return { left: r.left - box.left, right: r.right - box.left, top: r.top - box.top, bottom: r.bottom - box.top, cx: r.left - box.left + r.width / 2 }; });
    const isThree = Math.abs(c[0].top - c[1].top) < 8 && Math.abs(c[1].top - c[2].top) < 8;
    const isTwo = !isThree && Math.abs(c[0].top - c[1].top) < 8;
    let points: Point[], stops: Point[];
    if (isThree) {
      // Keep the route in the quiet editorial band between each card's rule and service label.
      const top = c[0].top + 102, bottom = c[3].top + 102, right = Math.min(grid.clientWidth - 8, c[2].right + 22), left = Math.max(8, c[3].left - 22), middle = (c[2].bottom + c[5].top) / 2;
      stops = [{ x: c[0].cx, y: top }, { x: c[1].cx, y: top }, { x: c[2].cx, y: top }, { x: c[3].cx, y: bottom }, { x: c[4].cx, y: bottom }, { x: c[5].cx, y: bottom }];
      points = [stops[0], stops[1], stops[2], { x: right, y: top }, { x: right, y: middle }, { x: left, y: middle }, { x: left, y: bottom }, stops[3], stops[4], stops[5]];
    } else if (isTwo) {
      const rows = [0, 2, 4].map((i) => c[i].top + 98), right = Math.min(grid.clientWidth - 8, c[1].right + 20), left = Math.max(8, c[0].left - 20);
      stops = [{ x: c[0].cx, y: rows[0] }, { x: c[1].cx, y: rows[0] }, { x: c[2].cx, y: rows[1] }, { x: c[3].cx, y: rows[1] }, { x: c[4].cx, y: rows[2] }, { x: c[5].cx, y: rows[2] }];
      points = [stops[0], stops[1], { x: right, y: rows[0] }, { x: right, y: rows[1] }, { x: left, y: rows[1] }, stops[2], stops[3], { x: right, y: rows[1] }, { x: right, y: rows[2] }, { x: left, y: rows[2] }, stops[4], stops[5]];
    } else { const x = Math.max(11, c[0].left - 18); stops = c.map((card) => ({ x, y: card.top + 34 })); points = stops; }
    return { d: circuitPath(points), stops, width: grid.clientWidth, height: grid.clientHeight };
  }, []);

  useEffect(() => {
    const section = sectionRef.current, grid = gridRef.current, path = pathRef.current, activePath = activePathRef.current, tracker = trackerRef.current;
    if (!section || !grid || !path || !activePath || !tracker) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const compactLayout = window.matchMedia("(max-width: 1023px)").matches;
    let trigger: ScrollTrigger | undefined;
    const initialise = () => {
      const route = buildPath(); if (!route) return;
      const svg = path.ownerSVGElement!; svg.setAttribute("viewBox", `0 0 ${route.width} ${route.height}`); path.setAttribute("d", route.d); activePath.setAttribute("d", route.d);
      const length = path.getTotalLength(); gsap.set(activePath, { strokeDasharray: length, strokeDashoffset: reduced || compactLayout ? 0 : length });
      route.stops.forEach((stop, index) => { const node = connectionRefs.current[index]; if (node) gsap.set(node, { x: stop.x, y: stop.y, opacity: reduced || compactLayout ? 1 : 0, scale: reduced || compactLayout ? 1 : .5, transformOrigin: "center" }); });
      const start = path.getPointAtLength(0); gsap.set(tracker, { x: start.x, y: start.y, opacity: reduced || compactLayout ? 0 : 1 }); trigger?.kill();
      if (reduced || compactLayout) { activeIndexRef.current = 5; setActiveIndex(5); return; }
      trigger = ScrollTrigger.create({ id: "services-signal", trigger: section, start: "top top", end: "bottom bottom", scrub: 1.15, pin: stageRef.current, anticipatePin: 1, invalidateOnRefresh: true,
        onUpdate: (self) => { const progress = Math.min(1, Math.max(0, self.progress)), drawn = progress * length, point = path.getPointAtLength(drawn); gsap.set(activePath, { strokeDashoffset: length - drawn }); gsap.set(tracker, { x: point.x, y: point.y }); const next = route.stops.reduce((current, stop, index) => Math.hypot(point.x - stop.x, point.y - stop.y) < 20 || progress >= (index + 1) / 7 ? Math.max(current, index) : current, -1); if (activeIndexRef.current !== next) { activeIndexRef.current = next; setActiveIndex(next); } route.stops.forEach((_, index) => { const node = connectionRefs.current[index]; if (node) gsap.set(node, { opacity: index <= next ? 1 : 0, scale: index <= next ? 1 : .5 }); }); }
      });
    };
    const ctx = gsap.context(() => {
      if (reduced) {
        gsap.set([headingRef.current, introRef.current], { opacity: 1, y: 0 });
      } else {
        gsap.fromTo(headingRef.current, { opacity: 0, y: 26, clipPath: "inset(0 0 100% 0)" }, { opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)", duration: .9, ease: "power3.out", scrollTrigger: { trigger: section, start: "top 72%" } });
        gsap.fromTo(introRef.current, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: .65, delay: .25, ease: "power2.out", scrollTrigger: { trigger: section, start: "top 72%" } });
        
        // Basic subtle mobile card stagger reveal
        const mm = gsap.matchMedia();
        mm.add("(max-width: 1023px)", () => {
          const cards = cardsRef.current.filter(Boolean);
          if (cards.length > 0) {
            gsap.fromTo(
              cards,
              { opacity: 0, y: 20 },
              {
                opacity: 1,
                y: 0,
                duration: 0.5,
                stagger: 0.08,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: gridRef.current,
                  start: "top 85%",
                },
              }
            );
          }
        });
      }
    }, section);
    const timer = window.setTimeout(() => { initialise(); ScrollTrigger.refresh(); }, 80), observer = new ResizeObserver(() => { initialise(); ScrollTrigger.refresh(); }); observer.observe(grid);
    return () => { window.clearTimeout(timer); observer.disconnect(); trigger?.kill(); ctx.revert(); };
  }, [buildPath]);

  return <section ref={sectionRef} id="services" aria-label="Comprehensive Integrated Advisory Services" className="relative h-auto lg:h-[175vh] bg-[#F5F1E8] text-[#071A33] scroll-mt-28">
    <div className="absolute inset-0 pointer-events-none opacity-[.035]" style={{ backgroundImage: "linear-gradient(rgba(7,26,51,.38) 1px,transparent 1px),linear-gradient(90deg,rgba(7,26,51,.38) 1px,transparent 1px)", backgroundSize: "64px 64px" }} />
    <div ref={stageRef} className="relative flex min-h-screen items-center overflow-visible px-5 pt-28 pb-16 sm:px-8 sm:pt-32 sm:pb-20 lg:h-screen lg:overflow-hidden lg:px-14 lg:py-8 xl:px-20">
      <div className="hidden lg:block pointer-events-none absolute -right-24 top-8 h-[32rem] w-[32rem] opacity-[.045]"><svg viewBox="0 0 500 500" className="h-full w-full fill-none stroke-[#071A33]" strokeWidth=".7"><circle cx="250" cy="250" r="214" strokeDasharray="3 7" /><circle cx="250" cy="250" r="154" /><circle cx="250" cy="250" r="94" strokeDasharray="2 5" /><path d="M20 250H480M250 20V480M97 97L403 403M403 97L97 403" /></svg></div>
      <div className="relative z-10 mx-auto w-full max-w-7xl"><div className="mb-9 grid grid-cols-1 items-end gap-7 lg:mb-10 lg:grid-cols-12 lg:gap-12"><div ref={headingRef} className="lg:col-span-7"><div className="mb-4 flex items-center gap-3"><span className="h-px w-8 bg-[#C89A3D]" /><span className="font-mono text-[10px] font-semibold tracking-[.24em] text-[#8F6B2C]">OUR SERVICES</span></div><h2 className="overflow-visible pb-[.13em] font-serif text-[clamp(2.55rem,5vw,4.35rem)] leading-[1.06] tracking-[-.035em]"><span className="block">Comprehensive advice.</span><span className="mt-1 block italic text-[#C89A3D]">Integrated for impact.</span></h2></div><p ref={introRef} className="max-w-md text-[15px] font-light leading-relaxed text-[#071A33]/70 lg:col-span-5 lg:pb-1">From financial strategy to tax and compliance, we bring every piece together — so you can focus on building what matters.</p></div>
        <div ref={gridRef} className="relative"><svg aria-hidden="true" className="hidden lg:block pointer-events-none absolute inset-0 z-20 h-full w-full overflow-visible" preserveAspectRatio="none"><defs><filter id="service-node-glow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter></defs><path ref={pathRef} fill="none" stroke="#B9AA91" strokeOpacity=".4" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" /><path ref={activePathRef} fill="none" stroke="#D4B573" strokeOpacity=".82" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />{SERVICES.map((service, index) => <g key={service.id} ref={(el) => { connectionRefs.current[index] = el; }} filter="url(#service-node-glow)"><circle r="8" fill="#F5F1E8" stroke="#D4B573" strokeOpacity=".28" /><circle r="3.2" fill="#D4B573" /><circle r="1" fill="#071A33" /></g>)}<g ref={trackerRef} filter="url(#service-node-glow)"><circle r="6" fill="#F5F1E8" stroke="#D4B573" strokeWidth="1.4" /><circle r="2.2" fill="#D4B573" /></g></svg>
          <div className="relative z-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 lg:gap-x-7 lg:gap-y-6">{SERVICES.map((service, index) => { const Icon = service.icon, current = activeIndex === index, reached = activeIndex >= index; return <article key={service.id} ref={(el) => { cardsRef.current[index] = el; }} className={`group relative min-h-[224px] rounded-[14px] border bg-[#FBF9F4] px-7 py-7 transition-[transform,border-color,background-color,box-shadow] duration-500 hover:-translate-y-[3px] sm:px-8 ${current ? "border-[#C89A3D]/80 bg-white shadow-[0_12px_28px_rgba(7,26,51,.055)]" : reached ? "border-[#B8AF9F]" : "border-[#DDD5C6]"}`}><span className={`absolute left-0 top-7 h-9 w-[2px] bg-[#C89A3D] transition-opacity duration-500 ${current ? "opacity-100" : "opacity-0"}`} /><div className="mb-7 flex items-center justify-between border-b border-[#DDD5C6]/80 pb-5"><span className={`grid h-9 w-9 place-items-center transition-colors duration-500 ${current ? "text-[#C89A3D]" : "text-[#071A33]/65"}`}><Icon className="h-[19px] w-[19px]" /></span><span className={`font-mono text-[11px] tracking-[.12em] ${reached ? "text-[#8F6B2C]" : "text-[#071A33]/45"}`}>{service.id}</span></div><p className={`mb-3 font-mono text-[9px] tracking-[.2em] ${current ? "text-[#C89A3D]" : "text-[#071A33]/48"}`}>{service.tag}</p><h3 className={`mb-3 font-serif text-[25px] leading-none tracking-[-.025em] transition-transform duration-500 ${current ? "-translate-y-1" : ""}`}>{service.title}</h3><p className={`max-w-[34ch] text-[13.5px] font-light leading-relaxed ${current ? "text-[#071A33]/80" : "text-[#071A33]/62"}`}>{service.description}</p></article>; })}</div>
        </div></div>
      </div>
  </section>;
}
