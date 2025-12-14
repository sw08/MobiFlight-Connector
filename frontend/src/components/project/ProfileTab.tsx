import { ConfigFile } from "@/types"
import { VariantProps } from "class-variance-authority"
import { publishOnMessageExchange } from "@/lib/hooks/appMessage"
import { CommandFileContextMenu } from "@/types/commands"
import { Button } from "@/components/ui/button"
import { buttonVariants } from "@/components/ui/variants"
import { forwardRef, useCallback, useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { InlineEditLabel, InlineEditLabelRef } from "../InlineEditLabel"
import { useDroppable } from "@dnd-kit/core"
import { clamp } from "lodash-es"
import ProfileTabContextMenu from "@/components/project/ProfileTab/ProfileTabContextMenu"

export interface ProfileTabProps extends VariantProps<typeof buttonVariants> {
  file: ConfigFile
  index: number
  totalCount: number
  selectActiveFile: (index: number) => void
}

export const ProfileTab = forwardRef<HTMLDivElement, ProfileTabProps>(({
  file,
  index,
  variant,
  totalCount,
  selectActiveFile: onSelectActiveFile,
}: ProfileTabProps, ref) => {
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
    // 1: "max-w-50 xl:max-w-70 3xl:max-w-65",
    // 2: "max-w-40 xl:max-w-60 3xl:max-w-65",
    // 3: "max-w-30 xl:max-w-50 3xl:max-w-65",
    // 4: "max-w-20 xl:max-w-40 3xl:max-w-65",
    // 5: "max-w-10 xl:max-w-30 3xl:max-w-65",
    // 6: "max-w-5 xl:max-w-20 3xl:max-w-50 4xl:max-w-60",
    // 7: "max-w-3 xl:max-w-7 3xl:max-w-30 4xl:max-w-50",
    // 8: "max-w-2 xl:max-w-7 3xl:max-w-25 4xl:max-w-40",
    // 9: "max-w-2 xl:max-w-7 3xl:max-w-20 4xl:max-w-35",
    // 10: "max-w-2 xl:max-w-15 3xl:max-w-15 4xl:max-w-30",
    // 11: "max-w-2 xl:max-w-5 3xl:max-w-10 4xl:max-w-25",
    // 12: "max-w-2 xl:max-w-5 3xl:max-w-5 4xl:max-w-20",
  }

  const maxInputWidth = labelWidthBasedOnCount[clamp(totalCount, 0, 0)]
  const labelClassName = `truncate transition-all duration-300 ease-in-out ${labelWidthBasedOnCount[clamp(totalCount, 0, 0)]}`

  const combinedRef = useCallback((node: HTMLDivElement | null) => {
    setNodeRef(node)
    if (typeof ref === 'function') ref(node)
    else if (ref) ref.current = node
  }, [ref, setNodeRef])

  return (
    <div
      className={`group flex flex-row justify-center border-b`}
      ref={combinedRef}
      role="tab"
      aria-selected={isActiveTab}
      title={optimisticLabel}
    >
      <Button      
        variant={variant}
        value={optimisticLabel}
        className={cn(
          groupHoverStyle,
          "rounded-r-none rounded-b-none border-r-0",
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
      <ProfileTabContextMenu 
        variant={variant}
        groupHoverStyle={groupHoverStyle}
        index={index}
        file={file}
        inlineEditRef={inlineEditRef}
      />
    </div>
  )
})

ProfileTab.displayName = "ProfileTab"
