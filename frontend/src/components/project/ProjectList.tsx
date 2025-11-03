import { ProjectSummary } from "@/types/project"
import ProjectListItem from "./ProjectListItem"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

export type ProjectListProps = {
  summarys: ProjectSummary[]
  activeProject?: ProjectSummary
}

const ProjectList = ({ summarys, activeProject }: ProjectListProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-2">
        <Button className="h-8 px-3 text-sm" variant={"default"}>
          All
        </Button>
        <Button className="h-8 px-3 text-sm" variant={"outline"}>
          Favorites
        </Button>
        <Button className="h-8 px-3 text-sm" variant={"outline"}>
          Recent
        </Button>
        <Button className="h-8 px-3 text-sm" variant={"outline"}>
          Microsoft
        </Button>
        <Button className="h-8 px-3 text-sm" variant={"outline"}>
          X-Plane
        </Button>
      </div>
      <ScrollArea className="h-108 pr-4">
        <div className="grid grid-cols-1 gap-2 pb-2 xl:grid-cols-2">
          {summarys.map((project) => {
            const isActive = activeProject?.Name === project.Name;
            return (
              <>
                <ProjectListItem
                  key={project.Name}
                  summary={project}
                  className="border-muted max-w-240 min-w-100 py-4"
                  active={isActive}
                />
              </>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProjectList
