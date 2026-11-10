"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/supabase/lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

type Lesson = {
  id: string;
  title: string;
  position: number;
  content: string;
};

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();

  const courseId = params.id as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [completedIds, setCompletedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourse() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/student-login");
        return;
      }

      const { data: courseData, error: courseError } =
        await supabase
          .from("courses")
          .select("id, title, description")
          .eq("id", courseId)
          .eq("published", true)
          .single();

      if (courseError || !courseData) {
        setError("Course not found.");
        setLoading(false);
        return;
      }

      const { data: enrollment, error: enrollmentError } =
        await supabase
          .from("enrollments")
          .select("id")
          .eq("student_id", user.id)
          .eq("course_id", courseId)
          .maybeSingle();

      if (enrollmentError || !enrollment) {
        setError("You must enrol in this course to view its lessons.");
        setLoading(false);
        return;
      }

      const { data: lessonData, error: lessonError } =
        await supabase
          .from("lessons")
          .select("id, title, position, content")
          .eq("course_id", courseId)
          .eq("published", true)
          .order("position", { ascending: true });

      if (lessonError) {
        setError(lessonError.message);
        setLoading(false);
        return;
      }

      const { data: progressData, error: progressError } =
        await supabase
          .from("lesson_progress")
          .select("lesson_id")
          .eq("student_id", user.id);

      if (progressError) {
        setError(progressError.message);
        setLoading(false);
        return;
      }

      setCourse(courseData);
      setLessons(lessonData ?? []);
      setCompletedIds(
        progressData?.map((item) => item.lesson_id) ?? []
      );

      setLoading(false);
    }

    loadCourse();
  }, [courseId, router]);

  if (loading) {
    return (
      <main className="container page-section">
        Loading course lessons...
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page-section">
        <h2>Course unavailable</h2>
        <p>{error}</p>
        <Link href="/courses">Browse courses →</Link>
      </main>
    );
  }

  if (!course) return null;

  const completedCount = lessons.filter((lesson) =>
    completedIds.includes(lesson.id)
  ).length;

  const percentage =
    lessons.length > 0
      ? Math.round((completedCount / lessons.length) * 100)
      : 0;

  return (
    <section className="page-section container">

      <div className="eyebrow dark-eyebrow">
        CORE MATHEMATICS
      </div>

      <h1>{course.title}</h1>

      <p>
        {course.description || "Your mathematics learning programme."}
      </p>

      <div className="dashboard-panel" style={{ marginTop: "25px" }}>
        <h2>Your course progress</h2>

        <p>
          {completedCount} of {lessons.length} lessons completed
        </p>

        <div
          style={{
            width: "100%",
            height: "10px",
            background: "#e5e7eb",
            borderRadius: "10px",
            overflow: "hidden",
            margin: "12px 0",
          }}
        >
          <div
            style={{
              width: `${percentage}%`,
              height: "100%",
              background: "#16a34a",
            }}
          />
        </div>

        <strong>{percentage}% complete</strong>
      </div>

      <div className="dashboard-panel" style={{ marginTop: "25px" }}>
        <div className="panel-heading">
          <h2>Course lessons</h2>
          <span>{lessons.length} lessons</span>
        </div>

        {lessons.length === 0 && (
          <p>No published lessons are available yet.</p>
        )}

        {lessons.map((lesson) => {
          const completed = completedIds.includes(lesson.id);

          return (
            <div
              key={lesson.id}
              className="continue-card"
              style={{ marginBottom: "15px" }}
            >
              <div className="continue-icon">
                {completed ? "✓" : lesson.position}
              </div>

              <div>
                <span className="course-level">
                  LESSON {lesson.position}
                </span>

                <h3>{lesson.title}</h3>

                <p>
                  {completed
                    ? "Completed"
                    : "Not completed yet"}
                </p>

                <Link
                  className="text-link"
                  href={`/lesson?lessonId=${lesson.id}`}
                >
                  {completed ? "Review lesson →" : "Start lesson →"}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ marginTop: "25px" }}>
        <Link className="text-link" href="/dashboard">
          ← Back to dashboard
        </Link>
      </div>

    </section>
  );
}