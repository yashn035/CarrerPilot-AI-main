import {
  Layout, FileText, Feather, Palette, Code, Cpu, Shield, Award, Terminal,
  Database, Server, Globe, Cloud, Zap, Layers, Activity, Sparkles,
  Briefcase, GraduationCap, CheckCircle, Search, Compass, BookOpen, Star
} from 'lucide-react';


export const CATEGORIES = [
  'All (60)',
  'FAANG & Tech',
  'ATS 99% Max',
  'Executive & Lead',
  'Ivy League & Classic',
  'Minimalist & Clean',
  'Finance & Consulting',
  'DevOps, Cloud & Systems',
  'AI, ML & Data Science'
];

export const TEMPLATES = [
  // 1. FAANG & Tech
  {
    id: 'modern',
    name: 'Modern Tech',
    category: 'FAANG & Tech',
    badge: 'Popular',
    description: 'Clean layout with royal blue accents, modern typography, and badge skills.',
    icon: Layout,
    color: 'from-blue-600 to-indigo-600',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-blue-600',
      headerBorderColor: 'border-blue-600',
      sectionHeaderStyle: 'blue-underline',
      skillStyle: 'badges',
      accentBg: 'bg-blue-600',
      badgeStyle: 'bg-blue-50 text-blue-800 border-blue-100'
    }
  },
  {
    id: 'google-clean',
    name: 'Google Engineering',
    category: 'FAANG & Tech',
    badge: 'FAANG Standard',
    description: 'High-density single-column format modeled after successful Google SWE applications.',
    icon: Code,
    color: 'from-blue-500 to-red-500',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-blue-700',
      headerBorderColor: 'border-blue-600',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'inline',
      accentBg: 'bg-blue-600',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  },
  {
    id: 'meta-frontend',
    name: 'Meta Product Engineer',
    category: 'FAANG & Tech',
    badge: 'FAANG Standard',
    description: 'Vibrant indigo header with structured bullet impact focus.',
    icon: Zap,
    color: 'from-indigo-600 to-blue-600',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-indigo-600',
      headerBorderColor: 'border-indigo-600',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-indigo-600',
      badgeStyle: 'bg-indigo-50 text-indigo-800 border-indigo-100'
    }
  },
  {
    id: 'amazon-leadership',
    name: 'Amazon LP Leader',
    category: 'FAANG & Tech',
    badge: 'FAANG Standard',
    description: 'STAR-method optimized bullet format with metric emphasis.',
    icon: Award,
    color: 'from-amber-600 to-orange-600',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'underline',
      headerAccentColor: 'text-amber-700',
      headerBorderColor: 'border-amber-600',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-amber-600',
      badgeStyle: 'bg-amber-50 text-amber-900 border-amber-200'
    }
  },
  {
    id: 'apple-design',
    name: 'Apple Systems Architect',
    category: 'FAANG & Tech',
    badge: 'FAANG Standard',
    description: 'Subtle slate tones, high contrast typography, and balanced white space.',
    icon: Layers,
    color: 'from-slate-700 to-slate-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'centered',
      headerAccentColor: 'text-slate-900',
      headerBorderColor: 'border-slate-800',
      sectionHeaderStyle: 'uppercase-bold',
      skillStyle: 'pills',
      accentBg: 'bg-slate-900',
      badgeStyle: 'bg-slate-100 text-slate-900 border-slate-300'
    }
  },
  {
    id: 'netflix-systems',
    name: 'Netflix High Scale',
    category: 'FAANG & Tech',
    badge: 'High Impact',
    description: 'Crimson accent headers designed to showcase high-throughput achievements.',
    icon: Activity,
    color: 'from-red-600 to-rose-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-red-700',
      headerBorderColor: 'border-red-600',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-red-700',
      badgeStyle: 'bg-red-50 text-red-800 border-red-200'
    }
  },
  {
    id: 'microsoft-cloud',
    name: 'Microsoft Solutions',
    category: 'FAANG & Tech',
    badge: 'Cloud Standard',
    description: 'Clean azure blue accents with prominent certification section styling.',
    icon: Cloud,
    color: 'from-sky-600 to-blue-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-sky-700',
      headerBorderColor: 'border-sky-600',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-sky-700',
      badgeStyle: 'bg-sky-50 text-sky-800 border-sky-200'
    }
  },
  {
    id: 'stripe-developer',
    name: 'Stripe API Architect',
    category: 'FAANG & Tech',
    badge: 'Developer Focus',
    description: 'Monospaced skill tags paired with crisp sans-serif headers.',
    icon: Terminal,
    color: 'from-purple-600 to-indigo-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-purple-700',
      headerBorderColor: 'border-purple-600',
      sectionHeaderStyle: 'blue-underline',
      skillStyle: 'tags',
      accentBg: 'bg-purple-700',
      badgeStyle: 'bg-purple-50 text-purple-900 border-purple-200'
    }
  },
  {
    id: 'uber-infra',
    name: 'Uber Distributed Systems',
    category: 'FAANG & Tech',
    badge: 'Infrastructure',
    description: 'Dark charcoal theme with dense bullet points for backend engineers.',
    icon: Server,
    color: 'from-gray-800 to-black',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-black',
      headerBorderColor: 'border-black',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-black',
      badgeStyle: 'bg-gray-100 text-gray-900 border-gray-300'
    }
  },

  // 2. ATS 99% Max
  {
    id: 'minimal',
    name: 'Minimal Mono',
    category: 'ATS 99% Max',
    badge: 'ATS Optimized',
    description: 'Distraction-free monospaced theme optimized for high ATS parser readability.',
    icon: Feather,
    color: 'from-emerald-600 to-teal-700',
    theme: {
      fontFamily: 'font-mono',
      headerStyle: 'minimal',
      headerAccentColor: 'text-emerald-700',
      headerBorderColor: 'border-emerald-600',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'inline',
      accentBg: 'bg-emerald-700',
      badgeStyle: 'bg-emerald-50 text-emerald-900 border-emerald-200'
    }
  },
  {
    id: 'ats-pure-text',
    name: 'ATS Pure Text',
    category: 'ATS 99% Max',
    badge: '100% Parser Score',
    description: 'Zero graphic elements, standard font hierarchy guaranteeing 100% ATS text parse accuracy.',
    icon: FileText,
    color: 'from-slate-600 to-slate-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'centered',
      headerAccentColor: 'text-slate-900',
      headerBorderColor: 'border-slate-400',
      sectionHeaderStyle: 'uppercase-bold',
      skillStyle: 'inline',
      accentBg: 'bg-slate-800',
      badgeStyle: 'bg-white text-slate-800'
    }
  },
  {
    id: 'ats-silicon-standard',
    name: 'Silicon ATS Standard',
    category: 'ATS 99% Max',
    badge: 'Top Choice',
    description: 'Single-column text flow with bold category markers for Workday & Greenhouse ATS.',
    icon: CheckCircle,
    color: 'from-teal-600 to-emerald-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'underline',
      headerAccentColor: 'text-teal-800',
      headerBorderColor: 'border-teal-700',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-teal-700',
      badgeStyle: 'bg-teal-50 text-teal-900 border-teal-200'
    }
  },
  {
    id: 'ats-monochrome',
    name: 'Monochrome ATS',
    category: 'ATS 99% Max',
    badge: 'Universal ATS',
    description: 'Black and white classic typography built for corporate Taleo and iCIMS systems.',
    icon: FileText,
    color: 'from-zinc-700 to-zinc-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-zinc-900',
      headerBorderColor: 'border-zinc-900',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-zinc-900',
      badgeStyle: 'bg-zinc-100 text-zinc-900 border-zinc-300'
    }
  },
  {
    id: 'ats-high-density',
    name: 'High-Density 1-Page',
    category: 'ATS 99% Max',
    badge: '1-Page Max',
    description: 'Tight margins and compact line heights allowing 4+ years experience on 1 page.',
    icon: Layout,
    color: 'from-blue-700 to-slate-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'compact',
      headerAccentColor: 'text-slate-900',
      headerBorderColor: 'border-slate-400',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-slate-900',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  },
  {
    id: 'ats-greenhouse-opt',
    name: 'Greenhouse Optimized',
    category: 'ATS 99% Max',
    badge: 'Greenhouse',
    description: 'Formatted specifically to score 98%+ on Greenhouse automated parsing benchmarks.',
    icon: Zap,
    color: 'from-emerald-700 to-green-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-emerald-800',
      headerBorderColor: 'border-emerald-700',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'inline',
      accentBg: 'bg-emerald-800',
      badgeStyle: 'bg-emerald-50 text-emerald-950 border-emerald-200'
    }
  },
  {
    id: 'ats-lever-ready',
    name: 'Lever Parser Perfect',
    category: 'ATS 99% Max',
    badge: 'Lever Engine',
    description: 'Clean linear reading order designed for Lever recruitment software indexing.',
    icon: CheckCircle,
    color: 'from-cyan-700 to-blue-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-cyan-800',
      headerBorderColor: 'border-cyan-700',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-cyan-800',
      badgeStyle: 'bg-cyan-50 text-cyan-950 border-cyan-200'
    }
  },
  {
    id: 'ats-workday-master',
    name: 'Workday Master',
    category: 'ATS 99% Max',
    badge: 'Workday System',
    description: 'Standardized headings mapped strictly to Workday AI candidate profile extractors.',
    icon: Shield,
    color: 'from-blue-800 to-indigo-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'centered',
      headerAccentColor: 'text-blue-900',
      headerBorderColor: 'border-blue-800',
      sectionHeaderStyle: 'uppercase-bold',
      skillStyle: 'inline',
      accentBg: 'bg-blue-900',
      badgeStyle: 'bg-blue-50 text-blue-950 border-blue-200'
    }
  },

  // 3. Executive & Lead
  {
    id: 'professional',
    name: 'Executive Professional',
    category: 'Executive & Lead',
    badge: 'Classic',
    description: 'Classic centered header, serif typography, and formal divider lines.',
    icon: FileText,
    color: 'from-slate-700 to-slate-900',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-slate-900',
      headerBorderColor: 'border-slate-900',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-slate-900',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  },
  {
    id: 'c-suite-lead',
    name: 'C-Suite VP Leadership',
    category: 'Executive & Lead',
    badge: 'VP & Director',
    description: 'Authoritative styling with executive summary box and revenue metric highlights.',
    icon: Briefcase,
    color: 'from-amber-700 to-stone-900',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'boxed',
      headerAccentColor: 'text-stone-900',
      headerBorderColor: 'border-amber-700',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-amber-800',
      badgeStyle: 'bg-amber-50 text-amber-950 border-amber-300'
    }
  },
  {
    id: 'cto-tech-director',
    name: 'CTO / Director of Engineering',
    category: 'Executive & Lead',
    badge: 'Executive',
    description: 'Combines technical depth with strategic leadership accomplishment sections.',
    icon: Cpu,
    color: 'from-slate-800 to-blue-950',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-slate-900',
      headerBorderColor: 'border-blue-900',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'badges',
      accentBg: 'bg-slate-900',
      badgeStyle: 'bg-slate-100 text-slate-900 border-slate-300'
    }
  },
  {
    id: 'principal-architect',
    name: 'Principal Systems Lead',
    category: 'Executive & Lead',
    badge: 'Staff / Principal',
    description: 'Designed for Staff/Principal engineers to highlight patents, systems, and impact.',
    icon: Server,
    color: 'from-indigo-900 to-purple-950',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'underline',
      headerAccentColor: 'text-indigo-950',
      headerBorderColor: 'border-indigo-800',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-indigo-950',
      badgeStyle: 'bg-indigo-50 text-indigo-950 border-indigo-200'
    }
  },
  {
    id: 'head-of-product',
    name: 'Head of Product Management',
    category: 'Executive & Lead',
    badge: 'Product VP',
    description: 'Spotlight on product growth metrics, user retention stats, and team leadership.',
    icon: Zap,
    color: 'from-rose-800 to-pink-950',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-rose-900',
      headerBorderColor: 'border-rose-700',
      sectionHeaderStyle: 'blue-underline',
      skillStyle: 'pills',
      accentBg: 'bg-rose-900',
      badgeStyle: 'bg-rose-50 text-rose-950 border-rose-200'
    }
  },
  {
    id: 'engineering-manager',
    name: 'Engineering Manager',
    category: 'Executive & Lead',
    badge: 'EM Standard',
    description: 'Balanced layout emphasizing team building, architecture, and agile delivery.',
    icon: Layers,
    color: 'from-blue-900 to-teal-950',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-blue-900',
      headerBorderColor: 'border-teal-700',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'inline',
      accentBg: 'bg-blue-950',
      badgeStyle: 'bg-teal-50 text-teal-950 border-teal-200'
    }
  },

  // 4. Ivy League & Classic
  {
    id: 'harvard-serif',
    name: 'Harvard Business Classic',
    category: 'Ivy League & Classic',
    badge: 'Ivy League',
    description: 'Traditional Georgia serif styling adhering strictly to Harvard Resume guidelines.',
    icon: GraduationCap,
    color: 'from-red-900 to-stone-900',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-red-950',
      headerBorderColor: 'border-red-900',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-red-950',
      badgeStyle: 'bg-white text-stone-900'
    }
  },
  {
    id: 'stanford-academic',
    name: 'Stanford Research Scholar',
    category: 'Ivy League & Classic',
    badge: 'Stanford',
    description: 'Refined serif layout tailored for graduate research and academic accomplishments.',
    icon: BookOpen,
    color: 'from-red-800 to-amber-950',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'underline',
      headerAccentColor: 'text-red-900',
      headerBorderColor: 'border-red-800',
      sectionHeaderStyle: 'uppercase-bold',
      skillStyle: 'inline',
      accentBg: 'bg-red-900',
      badgeStyle: 'bg-red-50 text-red-950 border-red-200'
    }
  },
  {
    id: 'mit-technical',
    name: 'MIT Technical Scholar',
    category: 'Ivy League & Classic',
    badge: 'MIT Standard',
    description: 'High-density technical serif layout for engineering and math dual-majors.',
    icon: Cpu,
    color: 'from-stone-800 to-red-950',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-stone-900',
      headerBorderColor: 'border-red-900',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'inline',
      accentBg: 'bg-stone-900',
      badgeStyle: 'bg-stone-100 text-stone-900 border-stone-300'
    }
  },
  {
    id: 'columbia-law-finance',
    name: 'Columbia Corporate & Law',
    category: 'Ivy League & Classic',
    badge: 'Columbia',
    description: 'Ultra formal layout suitable for corporate counsel, finance, and wall street entry.',
    icon: GraduationCap,
    color: 'from-sky-900 to-slate-900',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-sky-950',
      headerBorderColor: 'border-sky-900',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-sky-950',
      badgeStyle: 'bg-white text-slate-900'
    }
  },
  {
    id: 'oxford-traditional',
    name: 'Oxford Traditional',
    category: 'Ivy League & Classic',
    badge: 'UK Standard',
    description: 'UK & European classical CV layout with clean double divider rules.',
    icon: BookOpen,
    color: 'from-blue-950 to-indigo-950',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-indigo-950',
      headerBorderColor: 'border-indigo-900',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-indigo-950',
      badgeStyle: 'bg-white text-indigo-950'
    }
  },

  // 5. Minimalist & Clean
  {
    id: 'nordic-minimal',
    name: 'Nordic Clean Studio',
    category: 'Minimalist & Clean',
    badge: 'Ultra Clean',
    description: 'Minimalist Scandinavian aesthetic featuring generous whitespace and elegant typography.',
    icon: Feather,
    color: 'from-zinc-500 to-zinc-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'minimal',
      headerAccentColor: 'text-zinc-900',
      headerBorderColor: 'border-zinc-300',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'tags',
      accentBg: 'bg-zinc-800',
      badgeStyle: 'bg-zinc-100 text-zinc-800 border-zinc-200'
    }
  },
  {
    id: 'slate-minimal',
    name: 'Slate Monochrome',
    category: 'Minimalist & Clean',
    badge: 'Modern Sleek',
    description: 'Slate grey tone hierarchy with subtle section accents.',
    icon: Layout,
    color: 'from-slate-600 to-slate-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-slate-800',
      headerBorderColor: 'border-slate-400',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-slate-800',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  },
  {
    id: 'swiss-grid',
    name: 'Swiss Typographic Grid',
    category: 'Minimalist & Clean',
    badge: 'Swiss Style',
    description: 'Asymmetric typographic grid layout prioritizing hierarchy and extreme legibility.',
    icon: Palette,
    color: 'from-red-600 to-zinc-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-red-700',
      headerBorderColor: 'border-red-600',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'pills',
      accentBg: 'bg-red-700',
      badgeStyle: 'bg-red-50 text-red-900 border-red-200'
    }
  },
  {
    id: 'linear-mono',
    name: 'Linear Mono Developer',
    category: 'Minimalist & Clean',
    badge: 'Developer Theme',
    description: 'Monospace font theme tailored for modern Web3 and open-source contributors.',
    icon: Code,
    color: 'from-gray-700 to-black',
    theme: {
      fontFamily: 'font-mono',
      headerStyle: 'minimal',
      headerAccentColor: 'text-black',
      headerBorderColor: 'border-gray-600',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'tags',
      accentBg: 'bg-black',
      badgeStyle: 'bg-gray-100 text-black border-gray-300'
    }
  },

  // 6. Finance & Consulting
  {
    id: 'goldman-finance',
    name: 'Goldman Sachs Investment',
    category: 'Finance & Consulting',
    badge: 'Wall Street',
    description: 'Compact 10pt layout for investment banking, private equity, and M&A analysts.',
    icon: Briefcase,
    color: 'from-blue-900 to-indigo-950',
    theme: {
      fontFamily: 'font-serif',
      headerStyle: 'centered',
      headerAccentColor: 'text-blue-950',
      headerBorderColor: 'border-blue-900',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-blue-950',
      badgeStyle: 'bg-white text-slate-900'
    }
  },
  {
    id: 'mckinsey-consulting',
    name: 'McKinsey Strategy Consultant',
    category: 'Finance & Consulting',
    badge: 'MBB Standard',
    description: 'Forest green accent lines focusing heavily on quantitative client outcome metrics.',
    icon: Award,
    color: 'from-emerald-800 to-teal-950',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'underline',
      headerAccentColor: 'text-emerald-950',
      headerBorderColor: 'border-emerald-800',
      sectionHeaderStyle: 'heavy-bar',
      skillStyle: 'inline',
      accentBg: 'bg-emerald-900',
      badgeStyle: 'bg-emerald-50 text-emerald-950 border-emerald-200'
    }
  },
  {
    id: 'bcg-strategy',
    name: 'BCG Management Associate',
    category: 'Finance & Consulting',
    badge: 'Consulting',
    description: 'Clean navy layout structured around key strategic initiatives and financial KPIs.',
    icon: Briefcase,
    color: 'from-teal-800 to-slate-900',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-teal-900',
      headerBorderColor: 'border-teal-800',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'inline',
      accentBg: 'bg-teal-900',
      badgeStyle: 'bg-teal-50 text-teal-950 border-teal-200'
    }
  },
  {
    id: 'quant-trader',
    name: 'Jane Street Quant Trader',
    category: 'Finance & Consulting',
    badge: 'Quant / Trading',
    description: 'High math density layout featuring competitions, Putnam, and algorithmic stats.',
    icon: Terminal,
    color: 'from-amber-600 to-yellow-800',
    theme: {
      fontFamily: 'font-mono',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-amber-900',
      headerBorderColor: 'border-amber-700',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      accentBg: 'bg-amber-800',
      badgeStyle: 'bg-amber-50 text-amber-950 border-amber-200'
    }
  },

  // 7. DevOps, Cloud & Systems
  {
    id: 'aws-cloud-arch',
    name: 'AWS Solutions Architect',
    category: 'DevOps, Cloud & Systems',
    badge: 'AWS Certified',
    description: 'Orange badge accents tailored for cloud migrations and infrastructure automation.',
    icon: Cloud,
    color: 'from-orange-500 to-amber-600',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-orange-600',
      headerBorderColor: 'border-orange-500',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-orange-600',
      badgeStyle: 'bg-orange-50 text-orange-900 border-orange-200'
    }
  },
  {
    id: 'kubernetes-k8s',
    name: 'Kubernetes SRE Lead',
    category: 'DevOps, Cloud & Systems',
    badge: 'DevOps / SRE',
    description: 'Royal blue headers built for cluster orchestration and 99.999% uptime metrics.',
    icon: Server,
    color: 'from-blue-600 to-indigo-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-blue-800',
      headerBorderColor: 'border-blue-600',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      accentBg: 'bg-blue-700',
      badgeStyle: 'bg-blue-50 text-blue-900 border-blue-200'
    }
  },
  {
    id: 'cyber-security',
    name: 'Cyber Security & DevSecOps',
    category: 'DevOps, Cloud & Systems',
    badge: 'Security Lead',
    description: 'Dark green theme emphasizing compliance, penetration testing, and certifications.',
    icon: Shield,
    color: 'from-emerald-700 to-green-900',
    theme: {
      fontFamily: 'font-mono',
      headerStyle: 'minimal',
      headerAccentColor: 'text-emerald-800',
      headerBorderColor: 'border-emerald-600',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'tags',
      accentBg: 'bg-emerald-800',
      badgeStyle: 'bg-emerald-50 text-emerald-950 border-emerald-200'
    }
  },
  {
    id: 'docker-devops',
    name: 'Docker / CI-CD Specialist',
    category: 'DevOps, Cloud & Systems',
    badge: 'CI / CD Lead',
    description: 'Marine blue accent layout highlighting build pipelines and containerization.',
    icon: Server,
    color: 'from-cyan-600 to-blue-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-cyan-700',
      headerBorderColor: 'border-cyan-600',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-cyan-700',
      badgeStyle: 'bg-cyan-50 text-cyan-900 border-cyan-200'
    }
  },

  // 8. AI, ML & Data Science
  {
    id: 'openai-research',
    name: 'OpenAI ML Research Scientist',
    category: 'AI, ML & Data Science',
    badge: 'AI Research',
    description: 'Clean academic layout showcasing model architectures, publications, and benchmarks.',
    icon: Sparkles,
    color: 'from-teal-600 to-emerald-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-teal-700',
      headerBorderColor: 'border-teal-600',
      sectionHeaderStyle: 'blue-underline',
      skillStyle: 'badges',
      accentBg: 'bg-teal-700',
      badgeStyle: 'bg-teal-50 text-teal-900 border-teal-200'
    }
  },
  {
    id: 'databricks-data',
    name: 'Databricks Data Engineer',
    category: 'AI, ML & Data Science',
    badge: 'Big Data',
    description: 'Purple/cyan theme highlighting Spark pipelines, ETL workflows, and SQL optimization.',
    icon: Database,
    color: 'from-indigo-600 to-purple-800',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'left-bar',
      headerAccentColor: 'text-purple-800',
      headerBorderColor: 'border-purple-600',
      sectionHeaderStyle: 'left-bar',
      skillStyle: 'tags',
      accentBg: 'bg-purple-700',
      badgeStyle: 'bg-purple-50 text-purple-900 border-purple-200'
    }
  },
  {
    id: 'nvidia-cuda',
    name: 'NVIDIA GPU Systems Engineer',
    category: 'AI, ML & Data Science',
    badge: 'Hardware & ML',
    description: 'NVIDIA green theme highlighting CUDA optimization and high-performance computing.',
    icon: Cpu,
    color: 'from-green-600 to-emerald-800',
    theme: {
      fontFamily: 'font-mono',
      headerStyle: 'minimal',
      headerAccentColor: 'text-green-700',
      headerBorderColor: 'border-green-600',
      sectionHeaderStyle: 'dashed-underline',
      skillStyle: 'tags',
      accentBg: 'bg-green-700',
      badgeStyle: 'bg-green-50 text-green-950 border-green-200'
    }
  },
  {
    id: 'ai-prompt-engineer',
    name: 'LLM & AI Application Lead',
    category: 'AI, ML & Data Science',
    badge: 'GenAI Pro',
    description: 'Modern violet accents tailored for AI engineers building with Groq, LangChain, and RAG.',
    icon: Sparkles,
    color: 'from-purple-600 to-indigo-700',
    theme: {
      fontFamily: 'font-sans',
      headerStyle: 'modern',
      headerAccentColor: 'text-purple-700',
      headerBorderColor: 'border-purple-600',
      sectionHeaderStyle: 'solid-underline',
      skillStyle: 'badges',
      accentBg: 'bg-purple-700',
      badgeStyle: 'bg-purple-50 text-purple-900 border-purple-200'
    }
  }
];

// Helper generator to populate up to 60 total templates cleanly
const BASE_VARIATIONS = [
  { prefix: 'Apex', color: 'from-blue-700 to-indigo-800', category: 'FAANG & Tech', font: 'font-sans' },
  { prefix: 'Vanguard', color: 'from-slate-700 to-zinc-900', category: 'Executive & Lead', font: 'font-serif' },
  { prefix: 'Veritas', color: 'from-emerald-700 to-teal-800', category: 'ATS 99% Max', font: 'font-sans' },
  { prefix: 'Pinnacle', color: 'from-indigo-700 to-purple-800', category: 'FAANG & Tech', font: 'font-sans' },
  { prefix: 'Matrix', color: 'from-green-700 to-emerald-900', category: 'DevOps, Cloud & Systems', font: 'font-mono' },
  { prefix: 'Beacon', color: 'from-sky-700 to-blue-900', category: 'Ivy League & Classic', font: 'font-serif' },
  { prefix: 'Quantum', color: 'from-purple-700 to-indigo-900', category: 'AI, ML & Data Science', font: 'font-sans' },
  { prefix: 'Starlight', color: 'from-rose-700 to-pink-900', category: 'Minimalist & Clean', font: 'font-sans' },
  { prefix: 'Solstice', color: 'from-amber-700 to-orange-900', category: 'Finance & Consulting', font: 'font-serif' },
  { prefix: 'Horizon', color: 'from-cyan-700 to-teal-900', category: 'FAANG & Tech', font: 'font-sans' },
];

const ROLES = [
  'Senior Fullstack Lead', 'Staff Frontend Architect', 'Backend Infrastructure Engineer',
  'Data Engineering Specialist', 'Cloud Systems Specialist', 'Product Operations Director',
  'AI Systems Developer', 'Cyber Security Consultant', 'Quant Algorithm Developer',
  'Mobile Systems Architect', 'SRE Reliability Specialist', 'Machine Learning Scientist',
  'Enterprise Solution Architect', 'Core Database Engineer', 'DevOps Pipeline Lead',
  'Microservices Specialist', 'High-Performance C++ Engineer', 'Blockchain Protocol Developer',
  'Embedded Systems Lead', 'UI/UX Design Systems Lead', 'Distributed Cache Architect',
  'Real-Time Systems Lead', 'Big Data Pipeline Lead', 'Automated QA Architect',
  'Security Operations Lead', 'Growth Analytics Engineer', 'Product Delivery Lead',
  'Platform Reliability Engineer', 'Cloud Security Architect', 'Deep Learning Specialist'
];

// Generate extra unique templates if count < 60
while (TEMPLATES.length < 60) {
  const idx = TEMPLATES.length;
  const variation = BASE_VARIATIONS[idx % BASE_VARIATIONS.length];
  const roleName = ROLES[idx % ROLES.length];
  const templateId = `${variation.prefix.toLowerCase()}-${idx + 1}`;

  TEMPLATES.push({
    id: templateId,
    name: `${variation.prefix} ${roleName}`,
    category: variation.category,
    badge: idx % 3 === 0 ? 'ATS 99%' : idx % 2 === 0 ? 'FAANG Standard' : 'Popular',
    description: `Optimized layout format for ${roleName} roles with high ATS parser readability.`,
    icon: idx % 4 === 0 ? Code : idx % 3 === 0 ? Server : idx % 2 === 0 ? Cpu : Zap,
    color: variation.color,
    theme: {
      fontFamily: variation.font,
      headerStyle: idx % 3 === 0 ? 'left-bar' : idx % 2 === 0 ? 'modern' : 'centered',
      headerAccentColor: idx % 3 === 0 ? 'text-blue-700' : idx % 2 === 0 ? 'text-purple-700' : 'text-slate-900',
      headerBorderColor: 'border-slate-400',
      sectionHeaderStyle: idx % 4 === 0 ? 'left-bar' : idx % 3 === 0 ? 'blue-underline' : 'solid-underline',
      skillStyle: idx % 2 === 0 ? 'badges' : 'inline',
      accentBg: 'bg-blue-700',
      badgeStyle: 'bg-slate-100 text-slate-800 border-slate-200'
    }
  });
}
