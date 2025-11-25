import ProjectCard from "@/components/project/ProjectCard"
import { ProjectCreateButton } from "@/components/project/ProjectCreateButton"
import ProjectList from "@/components/project/ProjectList"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import useMessageExchange from "@/lib/hooks/useMessageExchange"
import { useProjectStore } from "@/stores/projectStore"
import { useRecentProjects } from "@/stores/settingsStore"
import { CommandMainMenu } from "@/types/commands"
import { ProjectInfo } from "@/types/project"

const ProjectMainCard = () => {
  const { publish } = useMessageExchange()
  const { recentProjects } = useRecentProjects()
  const { project } = useProjectStore()
  const activeProject = project

  const loadProject = (project: ProjectInfo) => {
    publish({
      key: "CommandMainMenu",
      payload: {
        action: "file.recent",
        options: {
          project: project,
        },
      },
    } as CommandMainMenu)
  }

  return (
    <Card className="border-shadow-none flex flex-col border-none shadow-none xl:col-span-2">
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <h2>My Projects</h2>
            </CardTitle>
            <CardDescription>Quick access to my projects.</CardDescription>
          </div>
          <ProjectCreateButton />
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-row gap-8">
          <div className="flex min-w-96 flex-col gap-4">
            <div>
              <h3 className="text-lg font-semibold">Current Project</h3>
            </div>
            {activeProject ? (
              <ProjectCard summary={activeProject} className="" />
            ) : (
              <div>No project loaded</div>
            )}
          </div>
          <div className="flex h-full grow flex-col gap-4 overflow-hidden">
            <div className="grow-0">
              <h3 className="text-lg font-semibold">All Projects</h3>
            </div>
            <ProjectList
              summarys={recentProjects}
              activeProject={activeProject as ProjectInfo}
              onSelect={(project) => loadProject(project)}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProjectMainCard
