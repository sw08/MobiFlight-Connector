import { cn } from "@/lib/utils"
import { HtmlHTMLAttributes } from "react"

export type ControllerIconProps = {
  serial: string
}

const ControllerIconPath = {
  mobiflight: {
    mega: "/controller/type/mobiflight-mega.png",
    micro: "/controller/type/mobiflight-micro.png",
    nano: "/controller/type/mobiflight-nano.png",
    "miniCOCKPIT miniFCU": "/controller/minicockpit/minicockpit-logo.png",
  },
  joystick: {
    honeycomb: {
      "Alpha Flight Controls": "/controller/honeycomb/alpha-yoke.png",
      "Bravo Throttle Quadrant": "/controller/honeycomb/bravo-throttle.png",
    },
    octavi: {
      Octavi: "/controller/type/ocatvi-octavi.png",
    },
    saitek: {
      "Saitek Aviator Stick": "/controller/type/saitek-aviator-stick.png",
    },
    thrustmaster: {
      "Thrustmaster T.16000M": "/controller/type/thrustmaster-t16000m.png",
    },
    vkbsim: {
      "S-TECS MODERN THROTTLE MAX":
        "/controller/type/vkbsim-stecs-throttle.png",
      "S-TECS MODERN THROTTLE MAX STEM":
        "/controller/type/vkbsim-stecs-throttle.png",
      "S-TECS MODERN THROTTLE MAX STEM FSM.GA":
        "/controller/type/vkbsim-stecs-throttle.png",
      "S-TECS MODERN THROTTLE MINI":
        "/controller/type/vkbsim-stecs-throttle.png",
    },
    wingflex: {
      "FCU Cube": "/controller/type/wingflex-joystick.png",
    },
    winwing: {
      "WINWING MCDU-32-CAPTAIN": "/controller/type/winwing-mcdu.png",
    },
  },
  midi: {
    generic: "/controller/type/midi-generic.png",
  },
}

const FindControllerIconPath = (controllerType: string, deviceName: string) => {
  console.log(`FindControllerIconPath: ${controllerType} > ${deviceName}`)
  const controllerIconPathSection =
    ControllerIconPath[controllerType as keyof typeof ControllerIconPath]

  if (!controllerIconPathSection) return "/controller/type/unknown.png"

  if (
    !controllerIconPathSection[
      deviceName as keyof typeof controllerIconPathSection
    ]
  )
    return `/controller/type/${controllerType}.png`

  return controllerIconPathSection[
    deviceName as keyof typeof controllerIconPathSection
  ]
}

const ControllerIcon = ({
  serial,
  className,
  ...props
}: HtmlHTMLAttributes<HTMLDivElement> & ControllerIconProps) => {
  console.log("ControllerIcon serial:", serial)
  const controllerType = serial.includes("SN-")
    ? "mobiflight"
    : serial.includes("JS-")
      ? "joystick"
      : serial.includes("MI-")
        ? "midi"
        : "unknown"

  const deviceName = serial.split("/")[0].trim() || ""
  const controllerIconUrl = FindControllerIconPath(controllerType, deviceName)

  return (
    <div
      title={deviceName}
      className={cn(
        `bg-background border-background flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-2 shadow-sm`,
        className,
      )}
      {...props}
    >
      <img
          className="h-9 object-cover"
          src={controllerIconUrl}
          alt={`${controllerType} controller icon`}
        />
    </div>
  )
}

export default ControllerIcon
