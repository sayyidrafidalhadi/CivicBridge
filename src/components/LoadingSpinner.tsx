export default function LoadingSpinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = { sm: 'h-5 w-5', md: 'h-8 w-8', lg: 'h-12 w-12' }
  return (
    <div className="flex justify-center items-center py-12">
      <div className={`rounded-full border-4 border-gray-300 border-t-black animate-spin ${sizeClasses[size]}`} />
    </div>
  )
}
