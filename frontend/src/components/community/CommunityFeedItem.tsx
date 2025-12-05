import { CommunityPost } from "@/types/feed"
import { Button } from "@/components/ui/button"
import useMessageExchange from "@/lib/hooks/useMessageExchange"
import { cn } from "@/lib/utils"
import Markdown, { Components } from "react-markdown"

export type CommunityFeedItemProps = {
  post: CommunityPost
}

const CommunityFeedItem = (props: CommunityFeedItemProps) => {
  const post = props.post
  const { publish } = useMessageExchange()

  const openUrl = (url: string) => {
    publish({
      key: "CommandOpenLinkInBrowser",
      payload: { url: url },
    })
  }

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const url = (e.target as HTMLAnchorElement).href
    openUrl(url)
  }

  const renderLink: Components["a"] = (props) => {
    return (
      <a
        {...props}
        onClick={handleLinkClick}
        className="text-blue-600 underline"
      />
    )
  }

  return (
    <div
      key={post.title}
      className={cn(
        "border-muted 4xl:flex-row flex flex-row justify-between gap-8 border-b lg:flex-col",
      )}
    >
      {post.media && post.media.type === "image" && (
        <div
          className={cn(
            "bg-background flex max-h-48 min-h-48 w-1/2 items-center justify-center overflow-hidden rounded-lg border shadow-md lg:w-full",
            post.media.className || "",
          )}
        >
          <img
            className={`max-h-60 w-full object-cover`}
            src={post.media.src}
            alt={post.media.alt}
          />
        </div>
      )}
      <div className="flex w-1/2 flex-col justify-between gap-4 lg:w-full">
        <div className="flex flex-col gap-4">
          <h4 className="text-xl font-semibold">{post.title}</h4>
          <div className="flex flex-col gap-4 text-sm">
            {post.content.map((paragraph, index) => (
              <Markdown key={index} components={{ a: renderLink }}>
                {paragraph}
              </Markdown>
            ))}
          </div>
        </div>
        {post.action && (
          <div className="">
            <Button size={"sm"} onClick={() => openUrl(post.action!.url)}>
              {post.action!.title}
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CommunityFeedItem
