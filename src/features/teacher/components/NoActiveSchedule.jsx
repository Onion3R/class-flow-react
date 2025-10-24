import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NoActiveSchedule() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="default">
          <Avatar className="size-12">
            <AvatarImage
              src="https://github.com/shadcn.png"
              className="grayscale"
            />
            <AvatarFallback>LR</AvatarFallback>
          </Avatar>
        </EmptyMedia>
        <EmptyTitle>No Active Schedule</EmptyTitle>
        <EmptyDescription>
          The administrator has not yet selected or generated an active schedule for this period. 
          Please check back later once a schedule has been finalized or contact the admin for more information.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
      </EmptyContent>
    </Empty>
  )
}
