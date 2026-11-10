import Link from "next/link";

export default function AdminPage() {
  const features = [
    ["📚", "Manage Courses", "/admin/courses"],
    ["🎥", "Upload Videos", "/admin/videos"],
    ["📄", "Upload Notes", "/admin/notes"],
    ["📝", "Manage Questions", "/admin/questions"],
    ["🎓", "Manage Students", "/admin/students"],
    ["📊", "Examination Results", "/admin/results"],
  ];

  return (
    <main style={{
      minHeight: "100vh",
      background: "#f4f6fa",
      padding: "40px 20px",
      fontFamily: "Arial, sans-serif"
    }}>
      <div style={{
        maxWidth: "1100px",
        margin: "auto"
      }}>
        <h1 style={{color: "#17365d"}}>
          WASSCE Maths Academy
        </h1>

        <p>Administrator Control Panel</p>

        <section style={{
          background: "#17365d",
          color: "white",
          padding: "30px",
          borderRadius: "15px",
          marginTop: "25px"
        }}>
          <h2>Welcome, Administrator!</h2>
          <p>
            Manage your mathematics courses,
            teaching materials and examinations.
          </p>
        </section>

        <h2 style={{marginTop: "35px"}}>
          Academy Management
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px"
        }}>
          {features.map(([icon, title, url]) => (
            <Link
              key={title}
              href={url}
              style={{
                background: "white",
                padding: "25px",
                borderRadius: "12px",
                textDecoration: "none",
                color: "#17365d",
                boxShadow: "0 3px 12px #00000010"
              }}
            >
              <h2>{icon}</h2>
              <h3>{title}</h3>
              <p>Manage {title.toLowerCase()}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}