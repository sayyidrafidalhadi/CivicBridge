import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Landmark, PlusCircle, Eye, CheckCircle2, ArrowRight } from 'lucide-react'

export default function Landing() {
  const { t } = useTranslation()

  const steps = [
    { icon: PlusCircle, title: t('landing.step1Title'), desc: t('landing.step1Desc') },
    { icon: Eye, title: t('landing.step2Title'), desc: t('landing.step2Desc') },
    { icon: CheckCircle2, title: t('landing.step3Title'), desc: t('landing.step3Desc') },
  ]

  return (
    <div>
      <section className="relative overflow-hidden bg-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-black shadow-lg">
              <Landmark className="h-8 w-8 text-white" />
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {t('app.name')}
            </h1>
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

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-bold text-gray-900">
            {t('landing.howItWorks')}
          </h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
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

      <section className="bg-gray-900 py-20">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-xl bg-white">
            <Landmark className="h-7 w-7 text-gray-900" />
          </div>
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
