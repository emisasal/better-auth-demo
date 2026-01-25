import Link from "next/link"

export default function page() {
  return (
    <main className="flex justify-center items-center w-full h-screen">
      <div className="flex flex-col items-center gap-3">
        <h1 className="font-bold text-3xl">This is a public page</h1>
        <Link href={"/"} className="underline">
          Back to Home
        </Link>
      </div>
    </main>
  )
}
