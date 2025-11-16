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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"
import { ProjectInfo } from "@/types/project"
import { useLocation } from "react-router"

type ProjectFormProps = {
  project: ProjectInfo
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: {
    Name: string
    Sim: string
    UseFsuipc: boolean
  }) => void
}

const ProjectForm = ({
  project,
  isOpen,
  onOpenChange,
  onSave,
}: ProjectFormProps) => {
  const [name, setName] = useState(project?.Name ?? "")
  const [simulator, setSimulator] = useState<string>(project?.Sim ?? "msfs")
  const [useFsuipc, setUseFsuipc] = useState(project?.UseFsuipc ?? false)
  
  const location = useLocation()
  const isEdit = location.state?.mode === "edit"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving")
    onSave({
      Name: name,
      Sim: simulator,
      UseFsuipc: useFsuipc
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {isEdit ? "Edit Project" : "Create New Project"}
          </DialogTitle>
          <DialogDescription className="text-md">
            Configure your project settings and select your aircraft.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          {/* Project Name */}
          <div className="grid gap-2">
            <Label htmlFor="project-name" className="text-base font-semibold">
              Project Name
            </Label>
            <Input
              id="project-name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Boeing 737 Home Cockpit"
              required
            />
          </div>

          {/* Flight Simulator Selection */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Flight Simulator</Label>
            <p className="text-muted-foreground text-sm">
              Select the primary simulator for this project.
            </p>
            <RadioGroup
              value={simulator}
              onValueChange={(value) => {
                setSimulator(value)
                setUseFsuipc(false) // Reset FSUIPC when changing simulator
              }}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="msfs" id="msfs" />
                <Label htmlFor="msfs" className="font-normal">
                  Microsoft Flight Simulator 2020 / 2024
                </Label>
              </div>
              {/* FSUIPC Option (only for MSFS) */}
              {simulator === "msfs" && (
                <div className="flex items-center space-x-2 pl-6">
                  <Checkbox
                    id="fsuipc"
                    checked={useFsuipc}
                    onCheckedChange={(checked) =>
                      setUseFsuipc(Boolean(checked))
                    }
                  />
                  <Label htmlFor="fsuipc" className="font-normal">
                    Use FSUIPC
                  </Label>
                </div>
              )}
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="x-plane" id="x-plane" />
                <Label htmlFor="x-plane" className="font-normal">
                  X-Plane 11 / 12
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="p3d" id="p3d" />
                <Label htmlFor="p3d" className="font-normal">
                  Prepar3D
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fsx" id="fsx" />
                <Label htmlFor="fsx" className="font-normal">
                  FSX / FS2004
                </Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>
            {isEdit ? "Save Changes" : "Create Project"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectForm
