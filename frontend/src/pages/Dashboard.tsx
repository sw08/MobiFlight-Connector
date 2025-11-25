import ControllerCard from "@/components/project/ControllerCard"
import ProjectCard from "@/components/project/ProjectCard"
import ProjectList from "@/components/project/ProjectList"
import { Button } from "@/components/ui/button"
import {
  CardContent,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useProjectStore } from "@/stores/projectStore"
import { useRecentProjects } from "@/stores/settingsStore"
import { ControllerType } from "@/types"
import { Controller } from "@/types/controller"
import { ProjectInfo } from "@/types/project"
import useMessageExchange from "@/lib/hooks/useMessageExchange"
import { CommandMainMenu } from "@/types/commands"
import { ProjectCreateButton } from "@/components/project/ProjectCreateButton"

const Dashboard = () => {
  const { recentProjects } = useRecentProjects()
  const { project } = useProjectStore()
  const { publish } = useMessageExchange()

  const controller: Controller[] = [
    {
      Name: "MobiFlight Mega",
      Vendor: "MobiFlight",
      ProductId: "1234",
      VendorId: "5678",
      Type: "MobiFlight" as ControllerType,
      Connected: true,
      ImageUrl: "/controller/mobiflight/mobiflight-mega.jpg",
      certified: false,
      firmwareUpdate: true,
    },
    {
      Name: "Thrustmaster T.16000M",
      Vendor: "Thrustmaster",
      ProductId: "1234",
      VendorId: "5678",
      Type: "Joystick" as ControllerType,
      Connected: true,
      ImageUrl: "/controller/thrustmaster/t16000m.jpg",
      certified: false,
    },
    {
      Name: "Bravo Throttle",
      Vendor: "Honeycomb Aeronautical",
      ProductId: "8765",
      VendorId: "4321",
      Type: "Joystick" as ControllerType,
      Connected: false,
      ImageUrl: "/controller/honeycomb/bravo-throttle.jpg",
      certified: true,
    },
    {
      Name: "Alpha Yoke",
      Vendor: "Honeycomb Aeronautical",
      ProductId: "1122",
      VendorId: "3344",
      Type: "Joystick" as ControllerType,
      Connected: true,
      ImageUrl: "/controller/honeycomb/alpha-yoke.jpg",
      certified: true,
    },
    {
      Name: "FCU Unit1",
      Vendor: "WinWing",
      ProductId: "5566",
      VendorId: "7788",
      Type: "Joystick" as ControllerType,
      Connected: false,
      ImageUrl: "/controller/winwing/fcu-unit1.jpg",
      certified: true,
    },
    {
      Name: "MCDU",
      Vendor: "WinWing",
      ProductId: "5566",
      VendorId: "7788",
      Type: "Joystick" as ControllerType,
      Connected: false,
      ImageUrl: "/controller/winwing/mcdu.jpg",
      certified: true,
    },
    {
      Name: "X-Touch Mini",
      Vendor: "Behringer",
      ProductId: "5566",
      VendorId: "7788",
      Type: "Midi" as ControllerType,
      Connected: true,
      ImageUrl: "/controller/behringer/x-touch-mini.jpg",
      certified: true,
    },
  ]

  const communityFeed = [
    {
      title: "MobiFlight v11 Released!",
      date: "2024-05-01",
      content:
        "We're excited to announce the release of MobiFlight v11, featuring new controller support and enhanced configuration options.",
    },
    {
      title: "Upcoming Webinar: Getting Started with MobiFlight",
      date: "2024-04-20",
      content:
        "Join us for a live webinar where we'll walk you through the basics of setting up MobiFlight and answer your questions.",
      featured: true,
      action: {
        title: "Register Now",
        url: "https://mobiflight.com/webinar",
      },
    },
    {
      title: "Join the MobiFlight Forum",
      date: "2024-04-15",
      content:
        "Connect with other MobiFlight users, share your projects, and get help on our official forum.",
    },
    {
      title: "New Tutorial: Setting Up MobiFlight with msfs",
      date: "2024-04-10",
      content:
        "Check out our latest tutorial on how to set up MobiFlight with Microsoft Flight Simulator 2020 for an immersive experience.",
    },
  ]

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
    <div className="grid grid-cols-1 gap-2 border-none xl:grid-cols-3 overflow-hidden">
      <Card className="flex flex-col border-shadow-none border-none shadow-none xl:col-span-2">
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

      <Card className="border-shadow-none bg-muted row-span-2 hidden rounded-none xl:block">
        <CardHeader>
          <CardTitle>MobiFlight Community</CardTitle>
          <CardDescription>
            News and updates from the MobiFlight community.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            {communityFeed.map((post) => (
              <div
                key={post.title}
                className={cn(
                  "border-muted border-b p-4",
                  post.featured && "bg-background rounded-md",
                )}
              >
                <h4 className="font-semibold">{post.title}</h4>
                <span className="text-muted-foreground text-sm">
                  {post.date}
                </span>
                <p className="text-sm">{post.content}</p>
                {post.action && (
                  <div className="mt-2">
                    <Button
                      size={"sm"}
                      onClick={() => window.open(post.action!.url, "_blank")}
                    >
                      {post.action!.title}
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-shadow-none border-none shadow-none xl:col-span-2 2xl:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex flex-col gap-2">
            <CardTitle>
              <h2>My Controllers</h2>
            </CardTitle>
            <CardDescription>
              Overview of my controllers used in my projects.
            </CardDescription>
          </div>
          <Button>Go to Settings</Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-row gap-2">
              <Button className="h-8 px-3 text-sm" variant={"default"}>
                All
              </Button>
              <Button className="h-8 px-3 text-sm" variant={"outline"}>
                MobiFlight
              </Button>
              <Button className="h-8 px-3 text-sm" variant={"outline"}>
                Joysticks
              </Button>
              <Button className="h-8 px-3 text-sm" variant={"outline"}>
                Midi
              </Button>
            </div>
            <div className="overflow-auto scroll-smooth">
              <div className="flex flex-row gap-6 pb-3">
                {controller.map((ctrl) => (
                  <ControllerCard
                    controller={ctrl}
                    key={ctrl.Name}
                    className="w-72"
                  />
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
