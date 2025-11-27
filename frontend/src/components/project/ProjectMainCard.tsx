import ProjectCard from "@/components/project/ProjectCard"
import { ProjectCreateButton } from "@/components/project/ProjectCreateButton"
import ProjectList from "@/components/project/ProjectList"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

  const showRecentProjects = recentProjects.length > 0

  return (
    <Card
      className="border-shadow-none flex flex-col border-none shadow-none"
      data-testid="project-main-card"
    >
      <CardHeader>
        <div className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <h2>My Projects</h2>
            </CardTitle>
            <CardDescription>Quick access to my projects.</CardDescription>
          </div>
          {showRecentProjects && <ProjectCreateButton />}
        </div>
      </CardHeader>
      <CardContent className="">
        {showRecentProjects ? (
          <div className="flex flex-row gap-8">
            <div className="flex min-w-96 flex-col gap-4">
              <div>
                {activeProject ? (
                  <h3 className="text-lg font-semibold">Current project</h3>
                ) : (
                  <h3 className="text-lg font-semibold">No active project</h3>
                )}
              </div>
              {activeProject ? (
                <ProjectCard summary={activeProject} className="" />
              ) : (
                <div className="border-primary/25 bg-card space-y-2 rounded-xl border p-4 shadow-md transition-all duration-200 ease-in-out hover:shadow-lg">
                  <div className="flex flex-col gap-4">
                    <div className="text-muted-foreground flex flex-row items-center justify-items-center gap-2">
                      No project is currently loaded.
                    </div>
                    <ProjectCreateButton />
                  </div>
                </div>
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
        ) : (
          <Card className="w-full">
            <CardContent className="flex flex-col items-center justify-center gap-4 pt-4">
              <div className="text-muted-foreground">
                Create your first project to get started!
              </div>
              <ProjectCreateButton />
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  )
}

export default ProjectMainCard
