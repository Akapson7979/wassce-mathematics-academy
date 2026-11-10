
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

type CourseProgress = {
  total: number;
  completed: number;
};

export default function DashboardPage() {
  const router = useRouter();

  const [name, setName] = useState("Student");
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [progress, setProgress] = useState<Record<string, CourseProgress>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const enrolledCourses = courses.filter((course) =>
    enrolledIds.includes(course.id)
  );

  const availableCourses = courses.filter(
    (course) => !enrolledIds.includes(course.id)
  );

  const completedTotal = Object.values(progress).reduce(
    (sum, item) => sum + item.completed,
    0
  );

  useEffect(() => {
    async function loadDashboard() {
      setLoading(true);
      setError("");

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/student-login");
        return;
      }

      setName(
        user.user_metadata?.full_name ||
          user.email?.split("@")[0] ||
          "Student"
      );

      const { data: courseData, error: courseError } =
        await supabase
          .from("courses")
          .select("id, title, description")
          .eq("published", true);

      if (courseError) {
        setError(courseError.message);
        setLoading(false);
        return;
      }

      const { data: enrollmentData, error: enrollmentError } =
        await supabase
          .from("enrollments")
          .select("course_id")
          .eq("student_id", user.id);

      if (enrollmentError) {
        setError(enrollmentError.message);
        setLoading(false);
        return;
      }

      const enrolled = enrollmentData?.map(
        (item) => item.course_id
      ) ?? [];

      setCourses(courseData ?? []);
      setEnrolledIds(enrolled);

      if (enrolled.length === 0) {
        setProgress({});
        setLoading(false);
        return;
      }

      const { data: lessonData, error: lessonError } =
        await supabase
          .from("lessons")
          .select("id, course_id")
          .in("course_id", enrolled)
          .eq("published", true);

      if (lessonError) {
        setError(lessonError.message);
        setLoading(false);
        return;
      }

      const lessonIds = lessonData?.map((lesson) => lesson.id) ?? [];

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

      const completedIds = new Set(
        progressData?.map((item) => item.lesson_id) ?? []
      );

      const updatedProgress: Record<string, CourseProgress> = {};

      enrolled.forEach((courseId) => {
        const courseLessons = (lessonData ?? []).filter(
          (lesson) => lesson.course_id === courseId
        );

        updatedProgress[courseId] = {
          total: courseLessons.length,
          completed: courseLessons.filter((lesson) =>
            completedIds.has(lesson.id)
          ).length,
        };
      });

      setProgress(updatedProgress);
      setLoading(false);
    }

    loadDashboard();
  }, [router]);

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
      setError(error.message);
      return;
    }

    router.replace("/student-login");
  }

  return (
    <section className="page-section container dashboard-page">

      <div className="dashboard-welcome">
        <div>
          <div className="eyebrow dark-eyebrow">
            STUDENT SPACE
          </div>

          <h1>
            Welcome, <em>{name}.</em>
          </h1>

          <p>
            Your WASSCE Mathematics learning dashboard.
            Explore courses and continue your studies.
          </p>
        </div>

        <div className="student-avatar">
          {name.charAt(0).toUpperCase()}
        </div>
      </div>

      <div className="dashboard-stats">
        <div>
          <span>AVAILABLE COURSES</span>
          <b>{courses.length.toString().padStart(2, "0")}</b>
          <small>Published courses</small>
        </div>

        <div>
          <span>COURSES ENROLLED</span>
          <b>{enrolledCourses.length.toString().padStart(2, "0")}</b>
          <small>Your enrolled courses</small>
        </div>

        <div>
          <span>LESSONS COMPLETED</span>
          <b>{completedTotal.toString().padStart(2, "0")}</b>
          <small>Saved learning progress</small>
        </div>
      </div>

      {loading && <p>Loading your dashboard...</p>}

      {error && (
        <p style={{ color: "red", margin: "15px 0" }}>
          {error}
        </p>
      )}

      {!loading && !error && (
        <div className="dashboard-columns">

          <div className="dashboard-panel">
            <div className="panel-heading">
              <h2>My enrolled courses</h2>
              <Link href="/courses">Browse all →</Link>
            </div>

            {enrolledCourses.length === 0 && (
              <p className="panel-copy">
                You haven't enrolled in any courses yet.
                Explore our courses to get started.
              </p>
            )}

            {enrolledCourses.map((course) => {
              const courseProgress = progress[course.id] ?? {
                total: 0,
                completed: 0,
              };

              const percentage =
                courseProgress.total > 0
                  ? Math.round(
                      (courseProgress.completed /
                        courseProgress.total) * 100
                    )
                  : 0;

              return (
                <div className="continue-card" key={course.id}>
                  <div className="continue-icon">x²</div>

                  <div>
                    <span className="course-level">
                      CORE MATHEMATICS
                    </span>

                    <h3>{course.title}</h3>

                    <p>
                      {course.description ||
                        "Continue your mathematics studies."}
                    </p>

                    <p>
                      {courseProgress.completed} of{" "}
                      {courseProgress.total} lessons completed
                    </p>

                    <div
                      style={{
                        width: "100%",
                        height: "9px",
                        background: "#e5e7eb",
                        borderRadius: "10px",
                        overflow: "hidden",
                        margin: "10px 0",
                      }}
                    >
                      <div
                        style={{
                          width: `${percentage}%`,
                          height: "100%",
                          background: "#16a34a",
                          borderRadius: "10px",
                        }}
                      />
                    </div>

                    <strong>{percentage}% complete</strong>

                    {courseProgress.total > 0 && (
                      <p style={{ marginTop: "12px" }}>
                        <Link className="text-link" href="/lesson">
                          Continue learning →
                        </Link>
                      </p>
                    )}

                    {courseProgress.total === 0 && (
                      <p>No published lessons yet.</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="dashboard-panel">
            <div className="panel-heading">
              <h2>Available courses</h2>
            </div>

            {availableCourses.length === 0 && (
              <p className="panel-copy">
                You have enrolled in all currently published courses.
              </p>
            )}

            {availableCourses.map((course) => (
              <div className="continue-card" key={course.id}>
                <div className="continue-icon">x²</div>

                <div>
                  <span className="course-level">
                    CORE MATHEMATICS
                  </span>

                  <h3>{course.title}</h3>

                  <p>
                    {course.description ||
                      "Explore this mathematics course."}
                  </p>

                  <Link className="text-link" href="/courses">
                    Enrol now →
                  </Link>
                </div>
              </div>
            ))}

            <Link
              className="button button-dark full-button"
              href="/courses"
              style={{ marginTop: "15px" }}
            >
              Explore all courses →
            </Link>
          </div>
        </div>
      )}

      <div className="dashboard-panel" style={{ marginTop: "25px" }}>
        <div className="panel-heading">
          <h2>My account</h2>
        </div>

        <p className="panel-copy">
          Manage your learning session.
        </p>

        <button
          type="button"
          onClick={handleLogout}
          className="button button-dark full-button"
        >
          Logout
        </button>
      </div>

    </section>
  );
}
