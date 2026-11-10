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
  published: boolean;
};

export default function LessonPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const lessonId = searchParams.get("lessonId");

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [previousLesson, setPreviousLesson] = useState<Lesson | null>(null);
  const [nextLesson, setNextLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadLesson() {
      if (!lessonId) {
        setError("No lesson was selected.");
        setLoading(false);
        return;
      }

      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        router.replace("/student-login");
        return;
      }

      const { data: lessonData, error: lessonError } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .eq("published", true)
        .single();

      if (cancelled) return;

      if (lessonError || !lessonData) {
        setError("Lesson could not be found.");
        setLoading(false);
        return;
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id")
        .eq("student_id", user.id)
        .eq("course_id", lessonData.course_id)
        .maybeSingle();

      if (cancelled) return;

      if (enrollmentError || !enrollment) {
        setError("You must enrol in this course to access this lesson.");
        setLoading(false);
        return;
      }

      const { data: allLessons, error: lessonsError } = await supabase
        .from("lessons")
        .select("id, course_id, title, content, video_url, position, published")
        .eq("course_id", lessonData.course_id)
        .eq("published", true)
        .order("position", { ascending: true });

      if (cancelled) return;

      if (lessonsError) {
        setError("Could not load lesson navigation.");
        setLoading(false);
        return;
      }

      const currentIndex =
        allLessons?.findIndex((item) => item.id === lessonData.id) ?? -1;

      setPreviousLesson(
        currentIndex > 0 ? allLessons![currentIndex - 1] : null
      );

      setNextLesson(
        currentIndex >= 0 && currentIndex < allLessons!.length - 1
          ? allLessons![currentIndex + 1]
          : null
      );

      const { data: progress } = await supabase
        .from("lesson_progress")
        .select("id")
        .eq("student_id", user.id)
        .eq("lesson_id", lessonId)
        .maybeSingle();

      if (cancelled) return;

      setDone(!!progress);
      setLesson(lessonData);
      setLoading(false);
    }

    setLoading(true);
    setError("");
    setLesson(null);
    setDone(false);
    setPreviousLesson(null);
    setNextLesson(null);

    loadLesson();

    return () => {
      cancelled = true;
    };
  }, [lessonId, router]);

  async function markComplete() {
    if (!lesson || done || saving) return;

    setSaving(true);
    setError("");

    const { data: authData } = await supabase.auth.getUser();

    if (!authData.user) {
      router.replace("/student-login");
      setSaving(false);
      return;
    }

    const { error: saveError } = await supabase
      .from("lesson_progress")
      .insert({
        student_id: authData.user.id,
        lesson_id: lesson.id,
      });

    if (saveError) {
      if (saveError.code === "23505") {
        setDone(true);
      } else {
        setError(saveError.message);
      }
    } else {
      setDone(true);
    }

    setSaving(false);
  }

  if (loading) {
    return <main className="container page-section">Loading lesson...</main>;
  }

  if (error && !lesson) {
    return (
      <main className="container page-section">
        <h2>Lesson unavailable</h2>
        <p>{error}</p>
        <Link href="/courses">Back to courses</Link>
      </main>
    );
  }

  if (!lesson) return null;

  return (
    <section className="page-section container lesson-layout">
      <div className="lesson-main">
        <div className="eyebrow dark-eyebrow">
          ALGEBRA · LESSON {lesson.position}
        </div>

        <h1>{lesson.title}</h1>

        {lesson.video_url && (
          <div className="video-placeholder">
            <video controls width="100%" src={lesson.video_url}>
              Your browser does not support video playback.
            </video>
          </div>
        )}

        <div className="lesson-content">
          <h2>Lesson Notes</h2>

          <div style={{ whiteSpace: "pre-line", lineHeight: 1.9 }}>
            {lesson.content}
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button
            className={done ? "button button-success" : "button button-dark"}
            onClick={markComplete}
            disabled={done || saving}
          >
            {saving
              ? "Saving..."
              : done
                ? "✓ Lesson completed"
                : "Mark lesson as complete"}
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "15px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          {previousLesson ? (
            <Link
              className="button button-dark"
              href={`/lesson?lessonId=${previousLesson.id}`}
            >
              ← Previous Lesson
            </Link>
          ) : (
            <span />
          )}

          {nextLesson ? (
            <Link
              className="button button-dark"
              href={`/lesson?lessonId=${nextLesson.id}`}
            >
              Next Lesson →
            </Link>
          ) : (
            <Link className="button button-dark" href="/dashboard">
              Finish Course →
            </Link>
          )}
        </div>
      </div>

      <aside className="lesson-sidebar">
        <div className="sidebar-card">
          <span className="course-level">YOUR PROGRESS</span>

          <h3>{done ? "Lesson completed" : "Lesson in progress"}</h3>

          <p>
            {done
              ? "Your lesson completion has been saved."
              : "Complete this lesson and save your progress."}
          </p>

          <Link className="text-link" href="/dashboard">
            Back to dashboard →
          </Link>
        </div>
      </aside>
    </section>
  );
}
