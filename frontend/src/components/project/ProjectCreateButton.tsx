import { Button } from "@/components/ui/button"
import { useProjectModal } from "@/lib/hooks/useProjectModal"
import { IconPlus } from "@tabler/icons-react"

export const ProjectCreateButton = () => {
  const { showOverlay } = useProjectModal()
  return (
    <Button
      className="[&_svg]:size-6"
      onClick={() => showOverlay({ mode: "create" })}
    >
      <IconPlus /> Project
    </Button>
  )
}
