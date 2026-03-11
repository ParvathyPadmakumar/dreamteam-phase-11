"use client";
import { useState, useEffect } from "react";
import Calender from "@/app/calender";
import Login from "@/components/login";
import { login, register, getEvents, createEvent,deleteevent } from "@/lib/api";
import { savetoken, gettoken, removetoken, isAuthenticated } from "@/lib/auth";

type Event = {
  id: number;
  name: string;
  completedDates?:string[]; 
};

export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [newEvent, setNewEvent] = useState("");
  const [selectedEvent, setSelectedEvent]=useState<Event|null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated()) {
      setIsLoggedIn(true);
      fetchEvents();
    }
  }, []);

  async function fetchEvents() {
    try {
      const token = gettoken();
      if (!token) return;
      const data = await getEvents(token);
      setEvents(data.events);
    }catch (error){
      console.error("Failed to fetch events:", error);
    }}
  
  async function handleAuth(Email: string,Password: string) {
    setLoading(true);
    try {
    const data=isRegister?await register(Email,Password):await login(Email,Password);
    savetoken(data.access_token);
    setIsLoggedIn(true);
    setEmail("");
    setPassword("");
    fetchEvents();
    }catch (error) {
      alert(error instanceof Error ? error.message:"Authentication failed");
    }finally{
      setLoading(false);
    }
  }

  async function addEvent() {
    if (!newEvent.trim()) return;
    setLoading(true);
    try{
      const token = gettoken();
      if (!token) throw new Error("Not authenticated");
      const event = await createEvent(newEvent, token);
    setEvents([...events, event]);
    setSelectedEvent(event);
    setNewEvent("");
    setShowInput(false);
    } catch(error){
      alert(error instanceof Error ? error.message : "Failed to create event");
    }finally{
      setLoading(false);
    }
  }

  function handleLogout() {
    removetoken();
    setIsLoggedIn(false);
    setEvents([]);
    setSelectedEvent(null);
  }
  if (!isLoggedIn) {
    return (
      <Login
        isRegister={isRegister}
        loading={loading}
        onSubmitAuth={handleAuth}
        onToggleMode={() => setIsRegister((prev) => !prev)}
      />
    );
  }
  async function deleteeventbutton(){
    if(!selectedEvent)  
      return;
    try{
      const token = gettoken();
      if(!token) throw new Error("Not authenticated");
      await deleteevent(selectedEvent.id, token);
      setEvents(events.filter((event) => event.id !== selectedEvent.id));
      setSelectedEvent(null);
    }catch(error){
      alert(error instanceof Error ? error.message : "Failed to delete event");
    }
    finally
    {setLoading(false);}
    }
    
  return (
    <div className="flex min-h-screen items-center justify-center bg-tide font-mono dark:bg-tide">
      <main className="flex min-h-screen w-full max-w-6xl flex-col items-center py-20 px-10 bg-tide dark:bg-tide sm:items-start">
        <button onClick={handleLogout} className="bg-zinc-200 text-black-200 px-2.5 py-2.5 mb-20 self-end rounded-2xl hover:bg-blue dark:hover:bg-blue">
          <img src="/icon.svg" alt="Logout" className="w-15 h-6" />
        </button>

        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          
          <h1 className="text-5xl font-semibold gap-6 leading-10 tracking-tight text-zinc-200 dark:text-white">
            Habit and Streak Tracker
          </h1>
          <p className="font-script text-3xl leading-30 text-driftwood dark:text-tide-light">
            Boost your productivity!! 
          </p>
          <p className="font-script text-xl leading-15 text-zinc-500 dark:text-zinc-200 mt-4">
            One platform to keep track of all your events with daily monitoring and streak tracking :)
          </p>
        </div>


        <div className="flex flex-col w-full font-medium sm:flex-row mt-10">
        <div className="mt-15 w-full min-h-[60vh] border border-coral-300 p-12 sm:w-2/5">
        <h2 className="text-xl font-semibold mb-15 border-amber-800 text-zinc-200 dark:text-white">All Events</h2>
          <div className="grid grid-cols-1 ">
            <div
              onClick={() => setShowInput(true)}
              className="flex items-center justify-center h-14 cursor-pointer hover:bg-coral dark:hover:bg-coral">
              <span className="text-2xl font-bold text-zinc-200 dark:text-white">+ add</span>
            </div>

            {showInput && (
              <div className="h-14 border bg-zinc-100 dark:bg-zinc-200 px-2 py-2 flex items-center "> 
                <input
                  type="text"
                  placeholder="Enter event name"
                  value={newEvent}
                  onChange={(e) => setNewEvent(e.target.value)}
                  className="border text-black px-4 py-1 w-full"
                />
                <button
                  onClick={addEvent}
                  className="bg-black text-yellow-200 px-1 py-2 whitespace-nowrap ">
                  Add Event
                </button>
              </div>
            )}

            {events.map((event) => (
              <button
                key={event.id}
                type="button"
                onClick={() => setSelectedEvent(event)}
                className={`text-black flex items-center justify-center h-20 font-medium transition ${
                  selectedEvent?.id === event.id
                    ? "bg-coral dark:bg-orange-400"
                    : "bg-amber-100 dark:bg-amber-1000"
                }`}
              >
                {event.name}
              </button>
            ))}
            <p className="mt-4 text-xl text-white dark:text-zinc-200"> 
                  <span className="font-semibold text-zinc-200 dark:text-white">Total Events:</span> {events.length}
                </p>
          </div>
          
        </div>

          <div className="w-full min-h-[60vh] border border-coral-300  p-12 mt-15 min-w-[300px] text-white dark:text-white">
            <h2 className="text-xl font-semibold mb-10">Statistics</h2>
            {selectedEvent ? (
              <div className="space-y-4 text-zinc-400 dark:text-zinc-200">
                <p>
                  <span className="font-semibold">Selected Event:</span> {selectedEvent.name}
                </p>
                <div className="flex justify-end">
                  <button
                    onClick={deleteeventbutton}
                    disabled={loading}
                    className="bg-orange-900 text-white px-4 py-2 hover:bg-red-800"
                  >
                    {loading?"deleting..pls wait":"Delete Event"}
                  </button>
                </div>
                <p>
                  <span className="font-semibold">Event ID:</span> {selectedEvent.id}
                </p>
                <p>
                  <span className="font-semibold"> MM/DD/YY: {new Date().toLocaleDateString()} </span>
                </p>
                <br></br>
                <br></br>
                 <p> Mark completion below </p>
                 <Calender selectedEvent={selectedEvent} setEvents={setEvents} setSelectedEvent={setSelectedEvent} 
                 />
              </div>
            ) : (
              <p className="text-zinc-200 dark:text-zinc-200">
                Click on a task in the left panel to view its statistics.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
