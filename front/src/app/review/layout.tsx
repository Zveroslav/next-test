"use client";

import { useRouter } from "next/navigation";
import { ReviewItemProvider } from "../context/ReviewItemContext";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <div className="relative">

    <button
      onClick={handleBack}
      className="absolute left-20 top-4 text-1xl px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
    >
      ← Back
    </button>
    <ReviewItemProvider>
      {children}
    </ReviewItemProvider>
    </div>

  );
}
