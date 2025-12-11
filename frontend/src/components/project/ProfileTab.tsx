import { ConfigFile } from "@/types"
import { VariantProps } from "class-variance-authority"
import { IconDotsVertical, IconPencil, IconTrash } from "@tabler/icons-react"
import { publishOnMessageExchange } from "@/lib/hooks/appMessage"
import { CommandFileContextMenu } from "@/types/commands"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { buttonVariants } from "@/components/ui/variants"
import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useTranslation } from "react-i18next"
import { InlineEditLabel, InlineEditLabelRef } from "../InlineEditLabel"
import { useDroppable } from "@dnd-kit/core"
import { clamp } from "lodash-es"

export interface ProfileTabProps extends VariantProps<typeof buttonVariants> {
  file: ConfigFile
  index: number
  totalCount: number
  selectActiveFile: (index: number) => void
}

const ProfileTab = ({
  file,
  index,
  variant,
  totalCount,
  selectActiveFile: onSelectActiveFile,
}: ProfileTabProps) => {
  const { t } = useTranslation()
  const { publish } = publishOnMessageExchange()
  const inlineEditRef = useRef<InlineEditLabelRef>(null)
  const label = file.Label ?? file.FileName
  const [ optimisticLabel, setOptimisticLabel ] = useState(label)

  const isActiveTab = variant === "tabActive"

  useEffect(() => {
    setOptimisticLabel(label)
  }, [label])

  const onSave = (newLabel: string) => {
    setOptimisticLabel(newLabel)
    publish({
      key: "CommandFileContextMenu",
      payload: {
        action: "rename",
        index: index,
        file: {
          ...file,
          Label: newLabel,
        },
      },
    } as CommandFileContextMenu)
  }
  
  const groupHoverStyle =
    variant === "tabActive"
      ? "group-hover:bg-primary group-hover:text-primary-foreground"
      : "group-hover:bg-accent group-hover:text-accent-foreground"

  const { setNodeRef } = useDroppable({
    id: `file-button-${index}`,
    data: {
      type: `tab`,
      index: index,
    },
  })

  const labelWidthBasedOnCount: Record<number, string> = {
    0: "max-w-60 xl:max-w-80 3xl:max-w-65",
    1: "max-w-50 xl:max-w-70 3xl:max-w-65",
    2: "max-w-40 xl:max-w-60 3xl:max-w-65",
    3: "max-w-30 xl:max-w-50 3xl:max-w-65",
    4: "max-w-20 xl:max-w-40 3xl:max-w-65",
    5: "max-w-10 xl:max-w-30 3xl:max-w-65",
    6: "max-w-5 xl:max-w-20 3xl:max-w-50 4xl:max-w-60",
    7: "max-w-3 xl:max-w-7 3xl:max-w-30 4xl:max-w-50",
    8: "max-w-2 xl:max-w-7 3xl:max-w-25 4xl:max-w-40",
    9: "max-w-2 xl:max-w-7 3xl:max-w-20 4xl:max-w-35",
    10: "max-w-2 xl:max-w-15 3xl:max-w-15 4xl:max-w-30",
    11: "max-w-2 xl:max-w-5 3xl:max-w-10 4xl:max-w-25",
    12: "max-w-2 xl:max-w-5 3xl:max-w-5 4xl:max-w-20",
  }

  const maxInputWidth = labelWidthBasedOnCount[clamp(totalCount, 0, 10)]
  const labelClassName = `truncate transition-all duration-300 ease-in-out ${labelWidthBasedOnCount[clamp(totalCount, 0, 8)]}`

  return (
    <div
      className={`group flex justify-center`}
      ref={setNodeRef}
      role="tab"
      aria-selected={isActiveTab}
      title={optimisticLabel}
    >
      <Button
        variant={variant}
        value={optimisticLabel}
        className={cn(
          groupHoverStyle,
          "rounded-r-none rounded-b-none border-r-0 border-b-0",
          maxInputWidth
        )}
        onClick={() => onSelectActiveFile(index)}
      >
        <InlineEditLabel
          labelClassName={labelClassName}
          ref={inlineEditRef}
          value={optimisticLabel}
          onSave={onSave}
          disabled={!isActiveTab}
        />
      </Button>
      <div className="relative">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant={variant}
              className={cn(
                groupHoverStyle,
                "w-8 rounded-l-none rounded-b-none border-b-0 border-l-0 p-0 pb-0",
              )}
            >
              <span className="sr-only">{t("General.Action.OpenMenu")}</span>
              <IconDotsVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                inlineEditRef.current?.startEditing()
              }}
            >
              <IconPencil />
              {t("Project.File.Action.Rename")}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                publish({
                  key: "CommandFileContextMenu",
                  payload: {
                    action: "remove",
                    index: index,
                    file: file,
                  },
                } as CommandFileContextMenu)
              }}
            >
              <IconTrash />
              {t("Project.File.Action.Remove")}
            </DropdownMenuItem>
            {/* <DropdownMenuItem
              onClick={() => {
                publish({
                  key: "CommandFileContextMenu",
                  payload: {
                    action: "export",
                    index: index,
                    file: file,
                  },
                } as CommandFileContextMenu)
              }}
            >
              <IconFileExport />
              {t("Project.File.Action.Export")}
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

export default ProfileTab
