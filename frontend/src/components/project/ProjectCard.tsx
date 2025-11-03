import { ProjectSummary } from "@/types/project"
import {
  IconChevronRight,
  IconDeviceGamepad2,
  IconDotsVertical,
  IconFile,
  IconPlaneDeparture,
  IconPlayerPlayFilled,
  IconPlayerStopFilled,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"
import { HtmlHTMLAttributes } from "react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import TwoStateIcon from "../icons/TwoStateIcon"

export type ProjectCardProps = HtmlHTMLAttributes<HTMLDivElement> & {
  summary: ProjectSummary
}
const ProjectCardTitle = ({ summary }: { summary: ProjectSummary }) => {
  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-row items-center justify-start gap-2">
        <h2 className="truncate text-xl font-medium">{summary.Name}</h2>
      </div>
      <div>
        <IconChevronRight className="text-primary h-8" />
      </div>
    </div>
  )
}

export const ProjectCardImage = ({
  summary,
  className,
}: HtmlHTMLAttributes<HTMLDivElement> & { summary: ProjectSummary }) => {
  const imageUrl =
    summary.Thumbnail ||
    `/aircraft/default/${summary.Sims[0].Name.toLowerCase()}.jpg`

  return (
    <div className={cn("bg-accent rounded-lg", className)}>
      <img
        src={new URL(imageUrl, import.meta.url).href}
        alt={summary.Name}
        className="h-full w-full rounded-lg object-cover"
      />
    </div>
  )
}

export const ProjectCardStartStopButton = ({
  isAvailable,
  isRunning,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLButtonElement> & {
  isAvailable: boolean
  isRunning: boolean
}) => {
  return (
    <Button
      // disabled={isTesting}
      variant="ghost"
      className={cn(
        "text-md gap-1 p-1 hover:bg-none [&_svg]:size-7",
        className,
      )}
      onClick={() =>
        // handleMenuItemClick({ action: !isRunning ? "run" : "stop" })
        console.log("Run/Stop clicked")
      }
      {...props}
    >
      <TwoStateIcon
        state={isRunning}
        primaryIcon={IconPlayerPlayFilled}
        secondaryIcon={IconPlayerStopFilled}
        primaryClassName={
          isAvailable
            ? "fill-green-600 stroke-green-600"
            : "fill-none stroke-2 stroke-muted-foreground"
        }
        secondaryClassName="fill-red-700 stroke-red-700"
      />
    </Button>
  )
}

const ProjectCard = ({
  summary,
  className,
  ...otherProps
}: ProjectCardProps) => {
  const isRunning = summary.Name === "Fenix A320"
  const isAvailable = summary.Sims.every((sim) => sim.Available)

  return (
    <div
      {...otherProps}
      className={cn(
        "border-border bg-card space-y-2 rounded-xl p-4 shadow-md transition-all duration-200 ease-in-out hover:shadow-xl",
        className,
      )}
    >
      <ProjectCardTitle summary={summary} />
      <div className="flex flex-col gap-4">
        <div className="relative">
          <ProjectCardImage summary={summary} className="h-72" />
          <div className="absolute inset-0 flex items-start justify-start p-4">
            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-md">
              {summary.Favorite ? (
                <IconStarFilled className="h-8 fill-amber-400 stroke-amber-400" />
              ) : (
                <IconStar className="stroke-muted-foreground h-6" />
              )}
              </div>
          </div>
        </div>
        <div className="flex flex-row">
          <div className="flex flex-1 flex-col gap-4">
            <div className="text-muted-foreground flex flex-row items-center justify-items-center gap-2">
              {summary.Sims.map((s) => {
                const bgColor = s.Available
                  ? "bg-primary"
                  : "bg-muted-foreground"
                return (
                  <Badge key={s.Name} className={bgColor}>
                    {s.Name}
                  </Badge>
                )
              })}
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
            <div className="flex flex-row gap-4">
              <div className="flex flex-row gap-2">
                <IconDeviceGamepad2 className="text-muted-foreground" />
                <p className="text-muted-foreground">
                  {summary.Controllers.length}
                </p>
              </div>
              <div className="flex flex-row gap-2">
                <IconFile className="text-muted-foreground" />
                <p className="text-muted-foreground">5</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end justify-between">
            <div
              className="text-muted-foreground hover:text-foreground flex flex-row items-center font-semibold"
              role="button"
            >
              <IconDotsVertical className="h-6" />
            </div>
            <div className="-mb-2 flex flex-row items-end">
              <ProjectCardStartStopButton
                isAvailable={isAvailable}
                isRunning={isRunning}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectCard
