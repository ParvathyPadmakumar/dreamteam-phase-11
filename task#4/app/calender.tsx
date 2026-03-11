"use client";
import { useEffect, useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { updateEvent } from "@/lib/api";
import { gettoken } from "@/lib/auth";

type EventItem = {
  id: number;
  name: string;
  completedDates?: string[];
};

type CalenderProps = {
  selectedEvent: EventItem | null;
  setEvents: React.Dispatch<React.SetStateAction<EventItem[]>>;
  setSelectedEvent: React.Dispatch<React.SetStateAction<EventItem | null>>;
};

export default function Calender({ selectedEvent, setEvents, setSelectedEvent }: CalenderProps) {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [lastAttempt, setLastAttempt] = useState("Never");

  useEffect(() => {
    setCompletedDates(selectedEvent?.completedDates || []);
  }, [selectedEvent]);

  useEffect(() => {
    setCurrentStreak(getCurrentStreak(completedDates));
    setLongestStreak(getLongestStreak(completedDates));
    setLastAttempt(getLastAttempt(completedDates));
  }, [completedDates]);

  async function handleDateSelect(dates: Date[] | undefined) {
    if (!selectedEvent || !dates) return;

    const dateStrings = dates.map((d) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    }).sort();

    setCompletedDates(dateStrings);

    setEvents((prev) =>
      prev.map((evt) => {
        if (evt.id !== selectedEvent.id) return evt;
        return { ...evt, completedDates: dateStrings };
      })
    );

    setSelectedEvent((prev) => {
      if (!prev) return prev;
      return { ...prev, completedDates: dateStrings };
    });

    try {
      const token = gettoken();
      if (!token) throw new Error("Not authenticated");
      await updateEvent(selectedEvent.id,dateStrings,token);
    } catch (error) {
      console.error("Failed to sync completed dates:", error);
      alert(error instanceof Error ? error.message : "Failed to sync completed dates");
    }
  }

  function getCurrentStreak(dates: string[]) {
    if (!dates.length) return 0;

    const set = new Set(dates);
    let streak = 0;
    const d = new Date();

    while (true) {
      const key = d.toISOString().split("T")[0];
      if (set.has(key)) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }

  function getLongestStreak(dates: string[]) {
    if (!dates.length) return 0;

    const sorted = [...new Set(dates)].sort(); 
    let longest = 1;
    let current = 1;

    for (let i = 1; i < sorted.length; i++) {
      const prev = new Date(sorted[i - 1]);
      const curr = new Date(sorted[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);

      if (diff === 1) {
        current++;
        if (current > longest) longest = current;
      } else {
        current = 1;
      }
    }

    return longest;
  }

  function getLastAttempt(dates: string[]) {
    if (!dates.length) return "Never";
    const latest = [...dates].sort().at(-1);
    return latest || "Never";
  }

  if (!selectedEvent) {
    return <p className="text-zinc-500 dark:text-zinc-400">Select an event to view calendar.</p>;
  }

  const selectedDates = completedDates.map((dateStr) => new Date(dateStr));

  return (
    <div className="space-y-6">
      <Calendar
        selected={selectedDates}
        onSelect={handleDateSelect}
        mode="multiple"
        className="rounded-lg border border-zinc-200 dark:border-zinc-700"
      />
      
      <div className="grid grid-cols-3 gap-8 mt-40">
        <div className="rounded-lg border border-pink-100 dark:border-pink-100 p-4 bg-reef dark:bg-reef">
          <p className="text-s font-medium text-zinc-200 dark:text-zinc-200 mb-2">Longest Streak</p>
          <p className="text-3xl font-bold text-blue dark:text-blue">{longestStreak}</p>
          <p className="text-xs text-blue dark:text-blue mt-1">days</p>
        </div>

        <div className="rounded-lg border border-pink-100 dark:border-pink-100 p-4 bg-reef dark:bg-reef">
          <p className="text-xs font-medium text-zinc-200 dark:text-zinc-200 mb-2">Current Streak</p>
          <p className="text-3xl font-bold text-blue dark:text-blue">{currentStreak}</p>
          <p className="text-xs text-blue dark:text-blue mt-1">days</p>
        </div>

        <div className="rounded-lg border border-pink-100 dark:border-pink-100 p-4 bg-reef dark:bg-reef">
          <p className="text-xs font-medium text-zinc-200 dark:text-zinc-200 mb-2">Last Attempt</p>
          <p className="text-lg font-bold text-blue dark:text-blue">{lastAttempt}</p>
        </div>
      </div>
    </div>
  );
}