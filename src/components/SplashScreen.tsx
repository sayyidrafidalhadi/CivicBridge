export default function SplashScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="neo-card-sm p-10 flex flex-col items-center gap-6">
        <span className="brand text-4xl text-gray-900">Nammude Shabdham</span>
        <div className="h-8 w-8 rounded-full border-4 border-gray-300 border-t-black animate-spin" />
      </div>
    </div>
  )
}
