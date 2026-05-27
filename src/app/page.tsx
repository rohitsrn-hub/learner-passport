import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8">
      <h1 className="text-3xl font-bold mb-2">Learner Passport</h1>
      <p className="text-gray-600 mb-8 text-center max-w-md">
        AI-powered learner profiles for Shillong government school children.
      </p>
      <div className="flex gap-4">
        <Link
          href="/profiles"
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          View Profiles
        </Link>
      </div>
    </main>
  )
}
