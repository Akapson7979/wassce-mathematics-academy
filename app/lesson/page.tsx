import { Suspense } from "react";
import LessonContent from "./LessonContent";

export default function LessonPage() {
  return (
    <Suspense
      fallback={
        <main className="container page-section">
          Loading lesson...
        </main>
      }
    >
      <LessonContent />
    </Suspense>
  );
}