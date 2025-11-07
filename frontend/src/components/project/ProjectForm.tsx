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
import { ProjectSummary } from "@/types/project"

type ProjectFormProps = {
  project: ProjectSummary
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSave: (values: {
    name: string
    simulator: string
    useFsuipc: boolean
    aircraft: string[]
    // thumbnail?: File
  }) => void
}

const ProjectForm = ({
  project,
  isOpen,
  onOpenChange,
  onSave,
}: ProjectFormProps) => {
  const [name, setName] = useState(project?.Name ?? "")
  const [simulator, setSimulator] = useState<string>("msfs")
  const [useFsuipc, setUseFsuipc] = useState(false)
  const [selectedAircraft, setSelectedAircraft] = useState<string[]>([])
  // const [thumbnail, setThumbnail] = useState<File>()

  // Aircraft options based on simulator selection
  const aircraftOptions: Record<string, string[]> = {
    msfs: ["Boeing 737", "Airbus A320", "Cessna 172", "Fenix A320"],
    xplane: ["Zibo 737", "ToLiss A321", "Cessna 172"],
    fsx: ["PMDG 737", "Airbus A320", "Cessna 172"],
  }

  const handleAircraftToggle = (aircraft: string) => {
    setSelectedAircraft((prev) =>
      prev.includes(aircraft)
        ? prev.filter((a) => a !== aircraft)
        : [...prev, aircraft],
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Saving")
    onSave({
      name,
      simulator,
      useFsuipc,
      aircraft: selectedAircraft,
      // thumbnail,
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl">Create New Project</DialogTitle>
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
                setSelectedAircraft([]) // Reset aircraft selection
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
                <RadioGroupItem value="xplane" id="xplane" />
                <Label htmlFor="xplane" className="font-normal">
                  X-Plane 11 / 12
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fsx" id="fsx" />
                <Label htmlFor="fsx" className="font-normal">
                  Prepar3D / FSX / FS2004
                </Label>
              </div>
            </RadioGroup>
          </div>

          {/* Aircraft Selection */}
          <div className="grid gap-3">
            <Label className="text-base font-semibold">Aircraft</Label>
            <p className="text-muted-foreground text-sm">
              Select the aircraft you'll use in this project.
            </p>
            <div className="grid gap-2">
              {aircraftOptions[simulator]?.map((aircraft) => (
                <div key={aircraft} className="flex items-center space-x-2">
                  <Checkbox
                    id={`aircraft-${aircraft}`}
                    checked={selectedAircraft.includes(aircraft)}
                    onCheckedChange={() => handleAircraftToggle(aircraft)}
                  />
                  <Label
                    htmlFor={`aircraft-${aircraft}`}
                    className="font-normal"
                  >
                    {aircraft}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          {/* Thumbnail Upload */}
          {/* <div className="grid gap-2">
            <Label htmlFor="thumbnail" className="text-base font-semibold">
              Project Thumbnail
            </Label>
            <p className="text-muted-foreground text-sm">
              Upload an image to represent your project.
            </p>
            <Input
              id="thumbnail"
              name="thumbnail"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) setThumbnail(file)
              }}
            />
            {thumbnail && (
              <p className="text-muted-foreground text-sm">
                Selected: {thumbnail.name}
              </p>
            )}
          </div> */}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </DialogClose>
          <Button onClick={handleSubmit}>Create Project</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default ProjectForm
