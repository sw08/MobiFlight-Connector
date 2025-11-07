import { useLocation, useNavigate } from "react-router-dom"
import type { ProjectSummary } from "@/types/project"
import ProjectForm from "@/components/project/ProjectForm"

export default function NewProjectModalRoute() {
  const navigate = useNavigate()
  const close = () => navigate(-1)
  const location = useLocation()

  const project = location.state?.project as ProjectSummary | { Name: "" } as ProjectSummary

  return (
    <ProjectForm
      project={project}
      isOpen
      onOpenChange={(open: boolean) => {
        if (!open) close()
      }}
      onSave={async (values) => {
        console.log("Creating project:", values)
        // TODO: await createProject(values)
        close()
      }}
    />
  )
}