import React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { CornerDownRight , Copy} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useRandomBadgeColor } from "@/lib/hooks/useRandomBadgeColor"

function TableComponent({ data, searchValue }) {
  const { getColor } = useRandomBadgeColor()

  const filteredData = data
    .filter((e) => {
      const fullName = `${e.teacher.first_name} ${e.teacher.last_name}`.toLowerCase()
      const email = `${e.teacher.first_name}@gmail.com`.toLowerCase()
      const sections = e.sections_taught.join(" ").toLowerCase()

      return (
        fullName.includes(searchValue.toLowerCase()) ||
        email.includes(searchValue.toLowerCase()) ||
        sections.includes(searchValue.toLowerCase())
      )
    })
    .slice(0, 16)

  return (
    <div className="w-full rounded-xl overflow-auto shadow border">
      <ScrollArea className="h-[420px]">
        <Table className="rounded-xl overflow-hidden">
          <TableHeader className="dark:bg-neutral-900 bg-gray-300/20">
            <TableRow className="sticky top-0 z-10 dark:bg-neutral-900">
              <TableHead>Account</TableHead>
              <TableHead>Sections</TableHead>
              <TableHead className="text-center">Assigned Minutes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} className="h-24 text-center">
                  No matching records found.
                </TableCell>
              </TableRow>
            )}
            {filteredData.map((e, i) => {
              const assignedSubLength = e.subjects_assigned.filter(
                (value, index, self) => self.indexOf(value) === index
              ).length

              const sections = e.sections_taught.filter(
                (value, index, self) => self.indexOf(value) === index
              )

              const color = getColor(assignedSubLength + 2)

              return (
                <TableRow key={i} className="hover:bg-accent/50 p-2" >
                  <TableCell className="font-medium">
                    <div className="flex items-center justify-start">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div className="ml-2">
                        <h1 className="font-semibold flex items-center">
                          {e.teacher.first_name} {e.teacher.last_name} <Copy className="ml-1 w-3 h-3" />
                        </h1>
                        <p className="font-normal text-muted-foreground flex items-center justify-start">
                          <CornerDownRight className="w-4 h-4 mr-1" />
                          {e.teacher.first_name}@gmail.com
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-medium text-muted-foreground">
                    {sections.slice(0, 2).join(", ")}
                    {sections.length > 2 && (
                      <HoverCard>
                        <HoverCardTrigger>
                          <Badge
                            className="h-5 min-w-5 rounded-full px-1 font-medium ml-2 cursor-default"
                            variant="outline"
                          >
                            +{sections.length - 2}
                          </Badge>
                        </HoverCardTrigger>
                        <HoverCardContent className="grid grid-cols-3 w-auto gap-1">
                          {sections.map((section, index) => (
                            <p key={index} className="text-sm text-foreground">
                              {section}
                            </p>
                          ))}
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="ml-2 flex flex-col">
                      <span className="text-muted-foreground">
                        {e.total_minutes_assigned}
                        <span className="ml-1">
                          / <span className="font-semibold">{e.max_minutes_allowed}</span> mins
                        </span>
                      </span>
                      <span className="font-semibold text-foreground mt-1">
                        {e.utilization_percentage}%
                        <Tooltip>
                          <TooltipTrigger asChild className="cursor-default">
                            <Badge className={`ml-2 dark:text-white ${color.bg} ${color.text}`}>
                              {assignedSubLength} Assigned
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent className="bg-muted dark:text-white text-foreground">
                            <p>Number of subjects assigned to this teacher</p>
                          </TooltipContent>
                        </Tooltip>
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </ScrollArea>

      <div className="text-sm text-muted-foreground p-4 flex justify-between">
        <h1>
          {/* List of teachers with their workload */}
          Showing {filteredData.length} of {data.length} entries
        </h1>
        <h1>
          {/* List of teachers with their workload */}
          List of teachers with their workload
        </h1>
      </div>
    </div>
  )
}

export default TableComponent
