export default function Loading() {
  return (
    <div className="page" aria-busy="true" aria-label="Loading">
      <div className="skel" style={{ height: 14, width: 160, marginBottom: 18 }} />
      <div className="skel" style={{ height: 52, width: "min(420px,70%)", marginBottom: 32 }} />
      <div className="grid g3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="card" style={{ display: "grid", gap: 12 }}>
            <div className="skel" style={{ height: 12, width: 100 }} />
            <div className="skel" style={{ height: 34, width: "80%" }} />
            <div className="skel" style={{ height: 12 }} />
            <div className="skel" style={{ height: 12, width: "70%" }} />
          </div>
        ))}
      </div>
      <div className="skel" style={{ height: 260, marginTop: 24, borderRadius: 8 }} />
    </div>
  );
}
