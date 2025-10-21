import { publishOnMessageExchange, useAppMessage } from "@/lib/hooks/appMessage"
import { Notification } from "@/types/messages"
import { toast } from "@/components/ui/ToastWrapper"
import { CommandMainMenu } from "@/types/commands"

export const ToastNotificationHandler = () => {
  const { publish } = publishOnMessageExchange()

  useAppMessage("Notification", (message) => {
    const notification = message.payload as Notification
    switch (notification.Event) {
      case "HubHopAutoUpdateCheck":
        toast({
          id: "hubhop-auto-update",
          title: "HubHop Update",
          description: "Your HubHop database is older than 7 days. Would you like to update it now?",
          button: {
            label: "Update Now",
            onClick: () => {
              publish({ key: "CommandMainMenu", payload: { action: "extras.hubhop.download" } } as CommandMainMenu)
            }
          }
        })
        break
    }
  })
  // This component doesn't render anything visible
  return null
}