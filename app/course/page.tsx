
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase/lib/supabase";

type Course = {
  id: string;
  title: string;
  description: string | null;
};

export default function StudentCourses() {
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledIds, setEnrolledIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function loadCourses() {
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

      setCourses(courseData ?? []);
      setEnrolledIds(
        enrollmentData?.map((item) => item.course_id) ?? []
      );

      setLoading(false);
    }

    loadCourses();
  }, [router]);

  async function handleEnroll(courseId: string) {
    setError("");
    setMessage("");
    setEnrollingId(courseId);

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      router.push("/student-login");
      setEnrollingId("");
      return;
    }

    if (enrolledIds.includes(courseId)) {
      setEnrollingId("");
      return;
    }

    const { error: enrollError } = await supabase
      .from("enrollments")
      .insert({
        student_id: user.id,
        course_id: courseId,
      });

    if (enrollError) {
      setError(enrollError.message);
    } else {
      setEnrolledIds((previous) => [...previous, courseId]);
      setMessage("Congratulations! You have enrolled successfully.");
    }

    setEnrollingId("");
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f4f6fa",
        padding: "40px 20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ maxWidth: "1000px", margin: "auto" }}>

        <h1 style={{ color: "#17365d", fontSize: "32px" }}>
          WASSCE Mathematics Courses
        </h1>

        <p style={{ color: "#555", marginBottom: "30px" }}>
          Explore our mathematics courses and improve your
          WASSCE preparation.
        </p>

        {loading && <p>Loading courses...</p>}

        {error && (
          <p style={{ color: "red", marginBottom: "15px" }}>
            {error}
          </p>
        )}

        {message && (
          <p style={{ color: "green", marginBottom: "15px" }}>
            {message}
          </p>
        )}

        {!loading && courses.length === 0 && !error && (
          <p>No published courses are available yet.</p>
        )}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
          }}
        >
          {courses.map((course) => {
            const enrolled = enrolledIds.includes(course.id);
            const enrolling = enrollingId === course.id;

            return (
              <div
                key={course.id}
                style={{
                  background: "white",
                  padding: "25px",
                  borderRadius: "12px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                }}
              >
                <h2
                  style={{
                    color: "#17365d",
                    fontSize: "22px",
                    marginBottom: "12px",
                  }}
                >
                  {course.title}
                </h2>

                <p style={{ color: "#555", lineHeight: "1.6" }}>
                  {course.description ||
                    "Explore this mathematics course."}
                </p>

                <button
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrolled || enrolling}
                  style={{
                    width: "100%",
                    marginTop: "20px",
                    padding: "12px",
                    border: "none",
                    borderRadius: "7px",
                    background: enrolled ? "#16a34a" : "#17365d",
                    color: "white",
                    fontWeight: "bold",
                    cursor: enrolled || enrolling
                      ? "not-allowed"
                      : "pointer",
                    opacity: enrolling ? 0.7 : 1,
                  }}
                >
                  {enrolled
                    ? "✓ Enrolled"
                    : enrolling
                    ? "Enrolling..."
                    : "Enrol Now"}
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: "30px" }}>
          <button
            onClick={() => router.push("/dashboard")}
            style={{
              padding: "12px 20px",
              background: "#e2e8f0",
              border: "none",
              borderRadius: "7px",
              cursor: "pointer",
            }}
          >
            Back to Dashboard
          </button>
        </div>

      </div>
    </main>
  );
}
