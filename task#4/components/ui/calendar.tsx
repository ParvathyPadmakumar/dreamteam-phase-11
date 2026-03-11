import * as React from "react"

type CalendarProps = {
  selected?: Date[]
  onSelect?: (dates: Date[] | undefined) => void
  mode?: "single" | "multiple"
  className?: string
}

export function Calendar({
  selected = [],
  onSelect,
  mode = "single",
  className = "",
}: CalendarProps) {
  const [month, setMonth] = React.useState(new Date())

  const year = month.getFullYear()
  const monthNum = month.getMonth()
  const firstDay = new Date(year, monthNum, 1).getDay()
  const daysInMonth = new Date(year, monthNum + 1, 0).getDate()

  const monthName = month.toLocaleString("default", { month: "long", year: "numeric" })

  const handlePrevMonth = () => {
    setMonth(new Date(year, monthNum - 1))
  }

  const handleNextMonth = () => {
    setMonth(new Date(year, monthNum + 1))
  }

  const handleDayClick = (day: number) => {
    const clickedDate = new Date(year, monthNum, day)
    const dateStr = clickedDate.toDateString()

    if (mode === "multiple" && onSelect) {
      const selectedSet = new Set(selected.map((d) => d.toDateString()))
      if (selectedSet.has(dateStr)) {
        selectedSet.delete(dateStr)
      } else {
        selectedSet.add(dateStr)
      }
      onSelect(Array.from(selectedSet).map((d) => new Date(d)))
    } else if (mode === "single" && onSelect) {
      onSelect([clickedDate])
    }
  }

  const blanks = Array.from({ length: firstDay })
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
  const selectedSet = new Set(selected.map((d) => d.toDateString()))

  return (
    <div className={`w-full p-4 ${className}`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold">{monthName}</h2>
          <div className="flex gap-1">
            <button
              onClick={handlePrevMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-0 text-lg"
            >
              ‹
            </button>
            <button
              onClick={handleNextMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950 dark:hover:bg-zinc-800 p-0 text-lg"
            >
              ›
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-zinc-600 dark:text-zinc-400 h-9">
              {day}
            </div>
          ))}

          {blanks.map((_, i) => (
            <div key={`blank-${i}`} className="h-9" />
          ))}

          {days.map((day) => {
            const dateStr = new Date(year, monthNum, day).toDateString()
            const isSelected = selectedSet.has(dateStr)

            return (
              <button
                key={day}
                onClick={() => handleDayClick(day)}
                className={`h-9 w-9 rounded-md text-sm font-medium transition-colors ${
                  isSelected
                    ? "bg-green-500 text-white hover:bg-green-500 dark:bg-green-500 dark:hover:bg-green-700"
                    : "text-zinc-900 hover:bg-zinc-100 dark:text-zinc-50 dark:hover:bg-zinc-800"
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
