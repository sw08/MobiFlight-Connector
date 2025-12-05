import CommunityFeedFilter from "@/components/community/CommunityFeedFilter"
import CommunityFeedItem from "@/components/community/CommunityFeedItem"
import IconBrandMobiFlightLogo from "@/components/icons/IconBrandMobiFlightLogo"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CommunityPost } from "@/types/feed"
import { useSearchParams } from "react-router"

const CommunityMainCard = () => {
  const [searchParams] = useSearchParams()
  const activeFilter = searchParams.get("feed_filter") || "all"

  const communityFeed = [
    {
      title: "Applying Full Throttle!",
      date: "2025-11-30",
      content: [
        "This year I took a big step: I now work on MobiFlight full time to push the project further than ever.",
        "Your financial support is essential to cover my living costs and keep MobiFlight advancing.",
      ],
      featured: false,
      tags: ["community"],
      media: {
        type: "image",
        src: "/feed/full-time.jpg",
        alt: "Full Throttle!",
        className: "bg-foreground dark:bg-background",
      },
      action: {
        title: "Support Us!",
        url: "https://mobiflight.com/donate",
      },
    },
    {
      title: "New products in the MobiFlight Store",
      date: "2025-11-30",
      content: [
        "Check out the latest additions to our store, including new modules and accessories to enhance your flight simulation experience.",
      ],
      featured: true,
      tags: ["shop"],
      media: {
        type: "image",
        src: "/feed/shop-new-boards.jpg",
        alt: "New products in MobiFlight Store",
        className: "bg-foreground dark:bg-background",
      },
      action: {
        title: "Register Now",
        url: "https://shop.mobiflight.com",
      },
    },
    {
      title: "Subscribe to Our Newsletter",
      date: "2025-11-30",
      content: [
        "Stay up-to-date with the **latest news, tutorials, and community highlights** by subscribing to [our newsletter](https://mobiflight.com/newsletter).",
      ],
      action: {
        title: "Subscribe",
        url: "https://mobiflight.com/newsletter",
      },
      media: {
        type: "image",
        src: "/feed/newsletter-subscribe.jpg",
        alt: "Subscribe to Our Newsletter",
        className: "bg-gray-100 dark:bg-gray-100",
      },
      tags: ["community"],
    },
    {
      title: "Meet MobiFlight at FSWeekend 2026!",
      date: "2025-12-04",
      content: [
        "We're excited to announce that MobiFlight will be present at FSWeekend 2026! Come meet the team, see live demos, and get exclusive insights into upcoming features.",
      ],
      action: {
        title: "Learn More",
        url: "https://flightsimweekend.com/",
      },
      media: {
        type: "image",
        src: "/feed/fsweekend-2025.jpg",
        alt: "Meet the team at FSWeekend 2026",
      },
      tags: ["events"],
    },
  ] as CommunityPost[]

  const filteredFeed = communityFeed.filter(
    (post) => post.tags.includes(activeFilter) || activeFilter === "all",
  )

  return (
    <Card className="border-shadow-none bg-muted flex h-full flex-col rounded-none">
      <CardHeader>
        <CardTitle className="flex flex-row gap-2">
          <IconBrandMobiFlightLogo /> Community Feed
        </CardTitle>
        <CardDescription>
          News and updates from the MobiFlight community.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex h-full flex-col gap-8">
        <CommunityFeedFilter />
        <div className="relative grow p-4">
          <div className="absolute inset-0 flex flex-col gap-8 overflow-auto pr-4">
            {filteredFeed.map((post, index) => (
              <div key={index} className="flex flex-col gap-8">
                <CommunityFeedItem post={post} />
                <div className="border" />
              </div>
            ))}
            {filteredFeed.length === 0 && (
              <p className="text-muted-foreground text-md bg-background rounded-md border p-8 text-center">
                No posts available.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CommunityMainCard
