import { ProjectSummary } from "@/types/project"
import { HtmlHTMLAttributes } from "react"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import { ProjectCardImage, ProjectCardStartStopButton } from "./ProjectCard"
import { IconPlaneDeparture } from "@tabler/icons-react"
import ProjectFavStar from "./ProjectFavStar"

export type ProjectListItemProps = HtmlHTMLAttributes<HTMLDivElement> & {
  summary: ProjectSummary
}

const ProjectListItem = ({
  summary: summary,
  className,
  ...props
}: ProjectListItemProps) => {
  const isRunning = summary.Name === "Fenix A320"
  const isAvailable = summary.Sims.every((sim) => sim.Available)

  return (
    <div
      className={cn(
        "group flex flex-row items-center justify-between gap-2 rounded-md  p-2",
        "shadow-sm transition-all duration-200 ease-in-out hover:shadow-md",
        className,
      )}
      {...props}
    >
      <div className="flex w-full flex-row gap-4">
        <div className="relative">
        <ProjectCardImage summary={summary} className="h-24 w-32" />
        <div className="absolute inset-0 flex items-start justify-start p-2">
        <ProjectFavStar summary={summary} variant="small" />
        </div>
        </div>
        <div className="flex w-1/2 flex-col gap-2">
          <h3 className="text-lg font-semibold">{summary.Name}</h3>
          <p className="flex w-1/2 flex-row gap-1">
            {summary.Sims.map((s) => {
              const bgColor = s.Available ? "bg-primary" : "bg-muted-foreground"
              return (
                <Badge key={s.Name} className={bgColor}>
                  {s.Name}
                </Badge>
              )
            })}
          </p>
          <div className="flex flex-row gap-2">
            {summary.Aircraft[0] && (
              <IconPlaneDeparture
                className={
                  summary.Aircraft[0].Available
                    ? "text-primary"
                    : "text-muted-foreground"
                }
              />
            )}
            <p className="text-muted-foreground truncate">
              {summary.Aircraft.map((a) => `${a.Name} (${a.Filter})`).join(
                ", ",
              )}
            </p>
          </div>
        </div>
        <div className="flex w-1/4 pr-8 items-end -mb-1">
          <ProjectCardStartStopButton
            isAvailable={isAvailable}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  )
}

export default ProjectListItem
