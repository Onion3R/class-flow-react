import { CalendarX2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"

export default function NoDataFetch() {
  return (
    <Empty>
  <EmptyHeader>
    <EmptyMedia variant="icon">
      <CalendarX2 />
    </EmptyMedia>
    <EmptyTitle>No Schedule Available</EmptyTitle>
    <EmptyDescription>
      There is currently no active schedule assigned to your account. Please check back later or contact the administrator for assistance.
    </EmptyDescription>
  </EmptyHeader>
  <EmptyContent>
    {/* Optional: Add a button or helpful link here */}
    {/* <Button variant="default">Contact Admin</Button> */}
  </EmptyContent>
</Empty>

  )
}
