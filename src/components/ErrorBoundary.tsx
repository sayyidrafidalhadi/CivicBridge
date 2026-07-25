import { Component } from 'react'
import i18n from '../i18n'

interface Props {
  children: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center p-8 bg-gray-100">
          <div className="max-w-md text-center">
            <span className="brand text-5xl text-gray-900">Nammude Shabdham</span>
            <h1 className="mt-6 text-2xl font-bold text-gray-900">{i18n.t('error.somethingWentWrong')}</h1>
            <p className="mt-3 text-gray-600">{this.state.error?.message || i18n.t('error.somethingWentWrong')}</p>
            <button onClick={() => window.location.reload()}
              className="mt-6 rounded-xl neo-btn-primary text-white px-6 py-2.5 text-sm font-bold uppercase tracking-wider">
              {i18n.t('error.reload')}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
