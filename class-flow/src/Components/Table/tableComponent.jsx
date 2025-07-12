import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { EllipsisVertical } from "lucide-react"
import UserList from "@Components/List/list"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Avatar } from "@/components/ui/avatar"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useEffect, useState } from "react"
import column from "@/Pages/RegularView/column"
import { redirect } from "react-router-dom"



const users = [
  { name: 'Alice Santos', avatar: '' },
  { name: 'Mark Dela Cruz' },
  { name: 'John Smith', avatar: 'https://i.pravatar.cc/150?img=4' },
  { name: 'Maria Garcia', avatar: '' },
  { name: 'David Lee', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'Sophia Kim' },
  { name: 'James Brown', avatar: 'https://i.pravatar.cc/150?img=6' },
  { name: 'Emily Chen', avatar: 'https://i.pravatar.cc/150?img=7' },
  { name: 'Carlos Mendoza' },
  { name: 'Fatima Al-Farsi', avatar: '' },
  { name: 'Liam O\'Connor', avatar: 'https://i.pravatar.cc/150?img=8' },
  { name: 'Priya Patel' }
];


export function TableComponent({data, columns}) {
  const [retrievedData, setRetrievedData] = useState([])
  const [retrievedColumns, setRetrievedColumns] = useState([])
  let  link = "https://meet.google.com/rhh-ayym-gzb?authuser=0";
  useEffect(() => {
    setRetrievedData(data)
    setRetrievedColumns(columns)
  }, [data])
  
 const handleJoin = () => {
    window.open(link, "_blank");
  };

  return (
    <Card className="overflow-x-auto bg-accent">
      <Dialog >
      <Table >
        <TableHeader>
          <TableRow>
            {retrievedColumns.map((column, idx) => (
              <TableHead key={idx} className={ column === "Link" ? "text-center" : "" } >{column}</TableHead>  
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {retrievedData.map((entry, idx) => (
            <DialogTrigger asChild key={idx} >
              <TableRow key={idx}>
                <TableCell>{entry.time}</TableCell>
                <TableCell>{entry.subject}</TableCell>
                <TableCell>{entry.room}</TableCell>
                <TableCell className="text-center">
                  {entry.link ? (
                    <a href={entry.link} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}>
                      <Button variant="link" className="text-blue-600">Join</Button>
                    </a>
                  ) : (
                    "—"
                  )}
                </TableCell>
              </TableRow>
            </DialogTrigger>
          ))}
          </TableBody>
      </Table>
      <DialogContent className=" w-full sm:w-[70%] h-[70vh] flex flex-col !min-h-[350px]">
        <DialogHeader>
          <DialogTitle className={"text-base"}>Calculus I</DialogTitle>
          <DialogDescription className={"text-sm"}>BSIT - 3A</DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 h-[calc(100%-60px)] gap-5 ">
          <div className="w-[70%]">
             <Card className="h-full ">
              <CardHeader>
                <CardTitle className={"text-gray-500 text-sm"}>Student List</CardTitle>
              </CardHeader>
              <CardContent className=" h-full min-h-[100px] ">
                <UserList users={users}/>
              </CardContent>
            </Card>
          </div>
          <div className="w-[30%]">
           <Card className="p-1.5 gap-1">
            <CardHeader className="p-1.5 flex w-full justify-between items-center">
              <div className="flex items-center justify-center">
                <img src="https://fonts.gstatic.com/s/i/productlogos/meet_2020q4/v6/web-48dp/logo_meet_2020q4_color_1x_web_48dp.png" alt="GoogleMeet"  className="w-6"/> 
                <span className="font-bold text-muted-foreground ml-2 text-sm">Meet</span>
             </div>
              <Popover>
                <PopoverTrigger>
                <EllipsisVertical className="h-5"/>
                </PopoverTrigger>
                  <PopoverContent className={"w-auto p-1.5"}>
                    <div >
                      <Button variant="ghost" className="w-full" >Copy Link</Button>                      
                    </div>
                  </PopoverContent>
             </Popover>
            </CardHeader>
            <CardContent className="p-1.5">
              <Button className="w-full" onClick={handleJoin}>Join</Button>
            </CardContent>
           </Card>
          </div>
        </div>
      </DialogContent>
      </Dialog>
    </Card>
  )
}
