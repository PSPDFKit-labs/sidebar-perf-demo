// The "use client" directive is necessary for using React hooks like useRef or useEffect.
// Without it, Next.js will throw a build error since hooks are not supported
// in server components.

"use client";

import React, { useEffect, useRef, useState } from "react";

let NutrientViewer;

export default function App() {
  const containerRef = useRef(null);
  const fileInputRef = useRef(null);
  const [documentPath, setDocumentPath] = useState(null);

  useEffect(() => {
    if (!documentPath) return;

    (async () => {
      const container = containerRef.current;
      if (!NutrientViewer) {
        NutrientViewer = await import("@nutrient-sdk/viewer");
      }

      if (container) {
        // Unload previous instance if it exists
        NutrientViewer?.unload(container);

        // Load new document
        NutrientViewer.load({
          container,
          baseUrl: window.location.origin + "/",
          document: documentPath,
        });
      }
    })();

    return () => {
      const container = containerRef.current;
      NutrientViewer?.unload(container);
    };
  }, [documentPath]);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file && file.type === "application/pdf") {
      const objectUrl = URL.createObjectURL(file);
      setDocumentPath(objectUrl);
    } else {
      alert("Please select a PDF file");
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 20px",
          backgroundColor: "#ffffff",
          borderBottom: "1px solid #e5e7eb",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "20px",
            fontWeight: "600",
            color: "#111827",
          }}
        >
          PDF Viewer
        </h1>
        <button
          onClick={handleButtonClick}
          style={{
            padding: "10px 20px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "background-color 0.2s",
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0051cc")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#0070f3")}
        >
          {documentPath ? "Change File" : "Select PDF File"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </header>
      <div
        ref={containerRef}
        style={{
          height: "calc(100vh - 60px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f9fafb",
        }}
      >
        {!documentPath && (
          <div
            style={{
              textAlign: "center",
              color: "#6b7280",
              fontSize: "18px",
            }}
          >
            <p style={{ marginBottom: "10px" }}>No PDF selected</p>
            <p style={{ fontSize: "14px" }}>
              Click "Select PDF File" above to choose a PDF to view
            </p>
          </div>
        )}
      </div>
      <style global jsx>
        {`
          * {
            margin: 0;
            padding: 0;
          }
        `}
      </style>
    </>
  );
}
