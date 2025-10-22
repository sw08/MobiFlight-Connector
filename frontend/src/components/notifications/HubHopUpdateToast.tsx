import { useHubHopState } from "@/stores/stateStore"
import { Progress } from "../ui/progress"
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react"
import { useEffect } from "react"
import { toast } from "sonner"

export type HubHopUpdateToastProps = {
  id: string,
  timeout?: number,
}

const HubHopUpdateToast = ({ id, timeout = 2000 }: HubHopUpdateToastProps) => {
  const HubHopState = useHubHopState()
  
  useEffect(() => {
    if (HubHopState?.Result === "Success" || HubHopState?.Result === "Error") {
      // Auto-dismiss the toast after completion
      const timer = setTimeout(() => {
        toast.dismiss(id)
      }, timeout) // Dismiss after specified timeout
      return () => clearTimeout(timer)
    }
  }, [HubHopState, id, timeout])

  return HubHopState?.Result === "InProgress" ? (
    <Progress value={HubHopState?.UpdateProgress} className="w-full h-6" />
  ) : HubHopState?.Result === "Success" ? (
    <div className="flex flex-row items-center gap-2">
      <IconCircleCheckFilled className="fill-green-700" /> HubHop update
      completed successfully!
    </div>
  ) : (
    <div className="flex flex-row items-center gap-2">
      <IconCircleXFilled className="fill-red-700" /> HubHop update
      <div>HubHop update failed. Please try again later.</div>
    </div>
  )
}

export default HubHopUpdateToast
