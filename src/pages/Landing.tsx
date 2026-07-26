import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  PlusCircle, Eye, CheckCircle2, ArrowRight, FileText,
  ShieldCheck, Users, Building2, Route, GitBranch, Bell,
  Droplets, Trash2, Car, Lightbulb, Wifi, Leaf, HelpCircle,
  Landmark, Globe, Monitor, ChevronDown
} from 'lucide-react'

const authorityTypes = [
  'mla', 'mp', 'ward_member', 'panchayat',
  'municipality', 'corporation', 'water_authority', 'electricity_board',
]

const civicIssues = [
  { icon: Droplets, titleKey: 'landing.issue1Title', descKey: 'landing.issue1Desc' },
  { icon: Trash2, titleKey: 'landing.issue2Title', descKey: 'landing.issue2Desc' },
  { icon: Car, titleKey: 'landing.issue3Title', descKey: 'landing.issue3Desc' },
  { icon: Droplets, titleKey: 'landing.issue4Title', descKey: 'landing.issue4Desc' },
  { icon: Lightbulb, titleKey: 'landing.issue5Title', descKey: 'landing.issue5Desc' },
  { icon: Leaf, titleKey: 'landing.issue6Title', descKey: 'landing.issue6Desc' },
]

const governanceTiers = [
  { icon: Users, titleKey: 'landing.govStep1Title', descKey: 'landing.govStep1Desc' },
  { icon: Building2, titleKey: 'landing.govStep2Title', descKey: 'landing.govStep2Desc' },
  { icon: Landmark, titleKey: 'landing.govStep3Title', descKey: 'landing.govStep3Desc' },
]

const keralaInitiatives = [
  { icon: Wifi, titleKey: 'landing.init1Title', descKey: 'landing.init1Desc' },
  { icon: Monitor, titleKey: 'landing.init2Title', descKey: 'landing.init2Desc' },
  { icon: Globe, titleKey: 'landing.init3Title', descKey: 'landing.init3Desc' },
  { icon: Leaf, titleKey: 'landing.init4Title', descKey: 'landing.init4Desc' },
]

const faqs = [
  { qKey: 'landing.faq1Q', aKey: 'landing.faq1A' },
  { qKey: 'landing.faq2Q', aKey: 'landing.faq2A' },
  { qKey: 'landing.faq3Q', aKey: 'landing.faq3A' },
  { qKey: 'landing.faq4Q', aKey: 'landing.faq4A' },
  { qKey: 'landing.faq5Q', aKey: 'landing.faq5A' },
]

export default function Landing() {
  const { t } = useTranslation()

  const steps = [
    { icon: PlusCircle, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
    { icon: Eye, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
    { icon: CheckCircle2, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
  ]

  const benefits = [
    { icon: Route, title: t('landing.benefit1Title'), desc: t('landing.benefit1Desc') },
    { icon: ShieldCheck, title: t('landing.benefit2Title'), desc: t('landing.benefit2Desc') },
    { icon: Users, title: t('landing.benefit3Title'), desc: t('landing.benefit3Desc') },
    { icon: Bell, title: t('landing.benefit4Title'), desc: t('landing.benefit4Desc') },
  ]

  const stats = [
    { icon: FileText, value: '--', label: t('landing.statComplaints') },
    { icon: CheckCircle2, value: '--', label: t('landing.statResolved') },
    { icon: Building2, value: '9', label: t('landing.statAuthorities') },
    { icon: Users, value: '--', label: t('landing.statCitizens') },
  ]

  return (
    <div>
      <section className="relative overflow-hidden bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <span className="brand text-5xl text-gray-900">Nammude Shabdham</span>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('landing.heroDesc')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
              <Link to="/report"
                className="inline-flex items-center gap-2 rounded-xl neo-btn-primary text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider shadow-lg">
                <PlusCircle className="h-4 w-4" /> {t('landing.reportIssue')}
              </Link>
              <Link to="/complaints"
                className="inline-flex items-center gap-2 rounded-xl neo-card-sm px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-gray-800">
                <Eye className="h-4 w-4" /> {t('landing.viewComplaints')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.statsTitle')}
          </h2>
          <div className="mt-10 grid gap-6 grid-cols-2 sm:grid-cols-4">
            {stats.map((stat, i) => (
              <div key={i} className="neo-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gray-200">
                  <stat.icon className="h-6 w-6 text-gray-900" />
                </div>
                <div className="mt-3 text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="mt-1 text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.howItWorks')}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {steps.map((item, i) => (
              <div key={i} className="neo-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-gray-200">
                  <item.icon className="h-7 w-7 text-gray-900" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-2 text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.benefitsTitle')}
          </h2>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {benefits.map((item, i) => (
              <div key={i} className="neo-card p-8 flex gap-5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-200">
                  <item.icon className="h-6 w-6 text-gray-900" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                  <p className="mt-1 text-gray-600">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.authoritiesTitle')}
          </h2>
          <p className="mt-3 text-center text-gray-600">
            {t('landing.authoritiesDesc')}
          </p>
          <div className="mt-10 grid gap-4 grid-cols-2 sm:grid-cols-4">
            {authorityTypes.map((type) => (
              <div key={type} className="neo-card-sm p-5 text-center">
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200">
                  <GitBranch className="h-5 w-5 text-gray-900" />
                </div>
                <div className="mt-2 text-sm font-semibold text-gray-900">
                  {t(`authority.${type}`)}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <span className="neo-badge inline-block px-4 py-1.5 text-xs font-bold text-gray-700 uppercase tracking-wider">
              + {t('authority.other')}
            </span>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.issuesTitle')}
          </h2>
          <p className="mt-3 text-center text-gray-600 max-w-3xl mx-auto">
            {t('landing.issuesDesc')}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {civicIssues.map((item, i) => (
              <div key={i} className="neo-card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100">
                  <item.icon className="h-5 w-5 text-amber-700" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{t(item.titleKey)}</h3>
                <p className="mt-1 text-sm text-gray-600">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-gray-50 py-20 -mt-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.governanceTitle')}
          </h2>
          <p className="mt-3 text-center text-gray-600 max-w-3xl mx-auto">
            {t('landing.governanceDesc')}
          </p>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {governanceTiers.map((item, i) => (
              <div key={i} className="neo-card p-8 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-100">
                  <item.icon className="h-7 w-7 text-emerald-700" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-gray-900">{t(item.titleKey)}</h3>
                <p className="mt-2 text-gray-600">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-center text-sm text-gray-500 max-w-2xl mx-auto">
            {t('landing.govExtra')}
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.keralaInitTitle')}
          </h2>
          <p className="mt-3 text-center text-gray-600 max-w-3xl mx-auto">
            {t('landing.keralaInitDesc')}
          </p>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {keralaInitiatives.map((item, i) => (
              <div key={i} className="neo-card p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <item.icon className="h-6 w-6 text-blue-700" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{t(item.titleKey)}</h3>
                <p className="mt-1 text-sm text-gray-600">{t(item.descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-gray-50 py-20 -mt-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.faqTitle')}
          </h2>
          <div className="mt-10 space-y-4">
            {faqs.map((item, i) => (
              <details key={i} className="neo-card group cursor-pointer">
                <summary className="flex items-center justify-between p-5 text-sm font-semibold text-gray-900 list-none">
                  {t(item.qKey)}
                  <ChevronDown className="h-4 w-4 text-gray-400 transition group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 text-sm text-gray-600">
                  {t(item.aKey)}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <span className="brand text-3xl text-white">Nammude Shabdham</span>
          <h2 className="mt-6 text-3xl font-bold text-white">
            {t('landing.ctaTitle')}
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            {t('landing.ctaDesc')}
          </p>
          <div className="mt-8 flex items-center justify-center gap-4">
            <Link to="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-white text-gray-900 px-8 py-3.5 text-sm font-bold uppercase tracking-wider shadow-lg transition hover:bg-gray-200">
              {t('landing.getStarted')} <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
