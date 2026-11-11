"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/supabase/lib/supabase";

type Lesson = {
  id: string;
  course_id: string;
  title: string;
  content: string;
  video_url: string | null;
  position: number;
};

export default function LessonContent() {
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");
  const router = useRouter();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    async function loadLesson() {
      if (!lessonId) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/student-login");
        return;
      }

      setUserId(user.id);

      const { data: currentLesson, error: lessonError } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .eq("published", true)
        .single();

      if (lessonError || !currentLesson) {
        setLoading(false);
        return;
      }

      const { data: enrollment } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", user.id)
        .eq("course_id", currentLesson.course_id)
        .maybeSingle();

      if (!enrollment) {
        router.push("/courses");
        return;
      }

      setLesson(currentLesson);

      const { data: courseLessons } = await supabase
        .from("lessons")
        .select("*")
        .eq("course_id", currentLesson.course_id)
        .eq("published", true)
        .order("position", { ascending: true });

      setLessons(courseLessons || []);

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("student_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      setCompleted(!!progress);
      setLoading(false);
    }

    loadLesson();
  }, [lessonId, router]);

  async function markComplete() {
    if (!userId || !lesson) return;

    const { error } = await supabase.from("lesson_progress").insert({
      student_id: userId,
      lesson_id: lesson.id,
    });

    if (error && error.code !== "23505") {
      alert("Unable to save lesson progress. Please try again.");
      return;
    }

    setCompleted(true);
  }

  if (loading) {
    return <main className="container page-section">Loading lesson...</main>;
  }

  if (!lesson) {
    return (
      <main className="container page-section">
        <h2>Lesson not found</h2>
        <Link href="/courses">Back to courses</Link>
      </main>
    );
  }

  const currentIndex = lessons.findIndex((item) => item.id === lesson.id);
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex >= 0 && currentIndex < lessons.length - 1
      ? lessons[currentIndex + 1]
      : null;

  return (
    <main className="container page-section">
      <div className="lesson-layout">
        <section className="lesson-main">
          <Link href="/dashboard">← Back to Dashboard</Link>

          <h1>{lesson.title}</h1>

          {lesson.video_url && (
            <div className="lesson-video">
              <iframe
                src={lesson.video_url}
                title={lesson.title}
                width="100%"
                height="400"
                allowFullScreen
              />
            </div>
          )}

          <div className="lesson-content">
            {lesson.content}
          </div>

          <div className="lesson-actions">
            {completed ? (
              <p>✓ Lesson completed</p>
            ) : (
              <button onClick={markComplete}>
                Mark as Complete
              </button>
            )}
          </div>

          <div className="lesson-navigation">
            {previousLesson && (
              <Link href={`/lesson?lessonId=${previousLesson.id}`}>
                ← Previous Lesson
              </Link>
            )}

            {nextLesson ? (
              <Link href={`/lesson?lessonId=${nextLesson.id}`}>
                Next Lesson →
              </Link>
            ) : (
              <Link href="/dashboard">Finish Course</Link>
            )}
          </div>
        </section>

        <aside className="lesson-sidebar">
          <h3>Course Lessons</h3>

          {lessons.map((item) => (
            <Link
              key={item.id}
              href={`/lesson?lessonId=${item.id}`}
              className={
                item.id === lesson.id ? "active-lesson" : ""
              }
            >
              {item.position}. {item.title}
            </Link>
          ))}
        </aside>
      </div>
    </main>
  );
}