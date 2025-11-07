import { ProjectSummary } from "@/types/project"
import { HtmlHTMLAttributes } from "react"
import { Badge } from "../ui/badge"
import { cn } from "@/lib/utils"
import {
  ProjectCardImage,
  ProjectCardStartStopButton,
  ProjectCardTitle,
} from "./ProjectCard"
import { IconPlaneDeparture } from "@tabler/icons-react"
import ProjectFavStar from "./ProjectFavStar"

export type ProjectListItemProps = HtmlHTMLAttributes<HTMLDivElement> & {
  summary: ProjectSummary
  active?: boolean
}

const ProjectListItem = ({
  summary: summary,
  className,
  active,
  ...props
}: ProjectListItemProps) => {
  const isRunning = summary.Name === "Fenix A320"
  const isAvailable = summary.Sim.Available
  const activateStateClassName = active ? "bg-primary/20" : "opacity-40 group-hover/projectlist:opacity-100"
  const bgColor = isAvailable
                    ? "bg-primary"
                    : "bg-muted-foreground"

  return (
    <div
      className={cn(
        "group flex flex-row items-center justify-between gap-2 rounded-md p-2",
        "shadow-sm transition-all duration-200 ease-in-out hover:shadow-md",
        "hover:border-primary hover:bg-primary/10 cursor-pointer",
        activateStateClassName,
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
        <div className="flex w-full flex-col gap-2">
          <ProjectCardTitle summary={summary} variant="listitem" />
          <div className="flex w-full flex-row items-end justify-between">
            <div className="flex flex-col gap-2">
              <div className="flex flex-row gap-1">
                  <Badge key={summary.Sim.Type} className={bgColor}>
                  {summary.Sim.Type}
                </Badge>
              </div>
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
            <ProjectCardStartStopButton
              isAvailable={isAvailable}
              isRunning={isRunning}
              className="-mb-1.5"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectListItem
