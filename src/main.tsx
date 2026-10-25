import React, { Suspense, lazy } from "react"
import ReactDOM from "react-dom/client"
import { PublicSite } from "./components/public/PublicSite"
import "./index.css"

// The public landing page does not need the administrative router.
// Loading it only for non-home routes avoids shipping its parsing cost on the first visit.
const RoutedApp = lazy(() => import("./app/App"))
const isLanding = window.location.pathname === "/"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {isLanding ? (
      <PublicSite />
    ) : (
      <Suspense fallback={<div className="admin-loading">Carregando…</div>}>
        <RoutedApp />
      </Suspense>
    )}
  </React.StrictMode>,
)
