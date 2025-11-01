import { ProjectSummary } from "@/types/project"
import ProjectListItem from "./ProjectListItem"
import { Button } from "../ui/button"
import { ScrollArea } from "../ui/scroll-area"

export type ProjectListProps = {
  summarys: ProjectSummary[]
}

const ProjectList = ({ summarys }: ProjectListProps) => {
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
        <div className="grid max-w-200 grid-cols-2 gap-2 pb-2">
          {summarys.map((project) => (
            <>
              <ProjectListItem
                key={project.Name}
                summary={project}
                className="border-muted max-w-120 py-4"
              />
            </>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}

export default ProjectList
