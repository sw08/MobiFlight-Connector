import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Project } from "@/types/project"
import { Checkbox } from "@/components/ui/checkbox"

type ProjectFormProps = {
  project: Project
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (project: Project) => void
}

const ProjectForm = ({
  project,
  isOpen,
  onOpenChange,
  onSave,
}: ProjectFormProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onSave(project)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl">Create New Project</DialogTitle>
            <DialogDescription className="text-md">
              Provide general information about your project.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">General information</h3>
              <p className="text-muted-foreground text-sm">
                Provide basic information about your project.
              </p>
            </div>
            <div className="flow flow-col">
              <Label htmlFor="name-1" className="text-md pb-0">
                Name
              </Label>
              <Input id="name-1" name="name" defaultValue={project.Name} />
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-semibold">Flight simulators</h3>
              <p className="text-muted-foreground text-md">
                Select the flight simulator you want to use with this project.
                It will simplify the available options when configuring.
              </p>
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-3">
                <Checkbox id="terms" />
                <Label htmlFor="terms" className="text-md">
                  Microsoft Flight Simulator 2020 / 2024
                </Label>
              </div>
              <div className="flex flex-col gap-2 pl-8">
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-md">
                    ProSim Home
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-md">
                    FSUIPC
                  </Label>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-md">
                X-Plane
              </Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox id="terms" />
              <Label htmlFor="terms" className="text-md">
                Prepar3D / FSX / FS2004 (using FSUIPC)
              </Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  )
}

export default ProjectForm
