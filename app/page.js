// The "use client" directive is necessary for using React hooks like useRef or useEffect.
// Without it, Next.js will throw a build error since hooks are not supported
// in server components.

"use client";

import React, { useEffect, useRef } from "react";

let NutrientViewer;

export default function App() {
  const containerRef = useRef(null);

  useEffect(() => {
    (async () => {
      const container = containerRef.current;
      NutrientViewer = await import("@nutrient-sdk/viewer");

      if (container) {
        NutrientViewer.load({
          container,
          baseUrl: window.location.origin + "/",
          document: "/example.pdf",
        });
      }
    })();

    return () => {
      NutrientViewer?.unload(container);
    };
  }, []);

  return (
    <>
      <div ref={containerRef} style={{ height: "100vh" }} />
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
