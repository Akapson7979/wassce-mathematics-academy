
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/supabase/lib/supabase";

type Course = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  published: boolean;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCourses() {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, slug, description, published")
        .eq("published", true)
        .order("title");

      if (error) {
        setError(error.message);
      } else {
        setCourses(data ?? []);
      }

      setLoading(false);
    }

    loadCourses();
  }, []);

  return (
    <main style={{
      padding: "40px 20px",
      minHeight: "100vh",
      background: "#f4f6fa",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "auto" }}>
        <h1 style={{ color: "#17365d" }}>
          WASSCE Mathematics Courses
        </h1>

        <p>Choose a course and begin your learning journey.</p>

        {loading && <p>Loading courses...</p>}

        {error && (
          <p style={{ color: "#dc2626" }}>
            {error}
          </p>
        )}

        {!loading && !error && courses.length === 0 && (
          <p>No published courses are available yet.</p>
        )}

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "20px",
          marginTop: "30px"
        }}>
          {courses.map((course) => (
            <article key={course.id} style={{
              background: "white",
              padding: "25px",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
            }}>
              <h2 style={{ color: "#17365d" }}>
                {course.title}
              </h2>

              <p>{course.description}</p>

              <a
                href={`/courses/${course.slug}`}
                style={{
                  display: "inline-block",
                  marginTop: "15px",
                  background: "#17365d",
                  color: "white",
                  padding: "10px 18px",
                  borderRadius: "6px",
                  textDecoration: "none"
                }}
              >
                View Course
              </a>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
