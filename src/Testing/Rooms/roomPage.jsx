
import { useState, useEffect } from "react"
import { AppWindowIcon, CodeIcon } from "lucide-react"
// import ExScheduleTableComponent from "../test"
import RoomScheduleTableComponent from "@/components/RoomTableSchedule/roomTableSchedule"

import { Button } from "@Components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@Components/ui/card"
import { Input } from "@Components/ui/input"
import { Label } from "@Components/ui/label"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@Components/ui/tabs"
import { ChevronRight, Plus } from 'lucide-react';
import { Badge } from "@Components/ui/badge"
import { getRooms } from '@/app/services/apiService';

export default function Test() {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState();
  const [defaultTabValue, setDefaultTabValue] = useState();
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    getRooms()
      .then((data) => {
        console.log("Raw rooms from API:", data);
        setRooms(data);
      })
      .catch((err) => console.error("Failed to fetch rooms", err));
  }, []);

  useEffect(() => {
    if (rooms.length > 0 && !defaultTabValue) {
      setDefaultTabValue(rooms[0].name);
      setAvailability(rooms[0].availability);
    }
    console.log(defaultTabValue);
  }, [rooms]);

  useEffect(() => {
    const selected = rooms.find((room) => room.id === selectedRoom);
    if (selected) {
      setAvailability(selected.availability);
    }
  }, [selectedRoom, rooms]);

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-bold my-2  container mx-auto ">Subjects</h1>
      {defaultTabValue && (
        <Tabs defaultValue={defaultTabValue} className='!flex  w-full h-full'>
          <div className='flex w-full gap-5'>
            <div className='max-w-[250px] w-[40%] '>
              <TabsList className='!max-w-none bg-none !border-none  flex-col bg-transparent h-auto '>
                {rooms.map((room) => (
                  <TabsTrigger
                    key={room.id}
                    value={room.name}
                    onClick={() => setSelectedRoom(room.id)}
                    className="flex items-center justify-between w-full px-4 py-3 hover:bg-muted !hover:border-none text-left data-[state=active]:border-none border-none "
                  >
                    <div className="flex items-center font-medium">
                      {room.name}
                      <Badge variant="secondary" className="ml-2">{room.room_type}</Badge>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </TabsTrigger>
                 
                ))}
              </TabsList>
            </div>
            <div className='flex 2  w-full'>
              {rooms.map((room, index) => (
                <TabsContent value={room.name} key={index} >
                  <Card className='bg-transparent p-0 border-none'>
                    <Card className='w-full'>
                      <CardHeader>
                        <CardTitle>{room.name}</CardTitle>
                        <CardDescription>
                          Near Building B, left side
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <RoomScheduleTableComponent availability={availability} />
                      </CardContent>
                    </Card>
                  </Card>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>
      )}
    </div>
  );
}
