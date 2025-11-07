import { ProjectSummary } from "@/types/project"
import { useLocation, useNavigate } from "react-router"

export type ProjectModalOptions = {
  mode: "create" | "edit"
  project?: ProjectSummary
}

export function useProjectModal() {
  const navigate = useNavigate()
  const location = useLocation()

  const showOverlay = (options: ProjectModalOptions) => {
    console.log("Showing project modal with options:", options)
    const route = options.mode === "create" ? "/project/new" : `/project/edit`
    navigate(route, { state: { backgroundLocation: location, project: options.project } })
  }

  const showStandalone = (options: ProjectModalOptions) => {
    const route = options.mode === "create" ? "/project/new" : `/project/edit`
    navigate(route, { state: { backgroundLocation: location, project: options.project } })
  }

  return { showOverlay, showStandalone }
}