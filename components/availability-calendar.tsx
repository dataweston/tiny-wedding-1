'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { NavArrowLeft, NavArrowRight } from 'iconoir-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, startOfWeek, endOfWeek, isBefore, startOfDay } from 'date-fns'

interface AvailabilityCalendarProps {
  onSelectDate: (date: Date) => void
  selectedDate: Date | null
}

export function AvailabilityCalendar({ onSelectDate, selectedDate }: AvailabilityCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadBookedDates()
    
    // Real-time subscription
    const channel = supabase
      .channel('bookings-calendar')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'bookings'
      }, (payload: any) => {
        if (payload.eventType === 'INSERT') {
          const newDate = new Date(payload.new.event_date)
          setBookedDates(prev => [...prev, newDate])
        } else if (payload.eventType === 'DELETE') {
          const deletedDate = new Date(payload.old.event_date)
          setBookedDates(prev => prev.filter(d => !isSameDay(d, deletedDate)))
        }
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  async function loadBookedDates() {
    setLoading(true)
    // This will be replaced with actual Supabase query once database is set up
    // For now, using placeholder data
    const { data, error } = await supabase
      .from('bookings')
      .select<{ event_date: string }>('event_date')
      .neq('status', 'CANCELLED')

    if (!error && data) {
      setBookedDates(data.map((booking) => new Date(booking.event_date)))
    }
    setLoading(false)
  }

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const isDateBooked = (date: Date) => {
    return bookedDates.some(bookedDate => isSameDay(bookedDate, date))
  }

  const isDatePast = (date: Date) => {
    return isBefore(date, startOfDay(new Date()))
  }

  const isDateDisabled = (date: Date) => {
    return isDateBooked(date) || isDatePast(date)
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        >
          <NavArrowLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-xl font-semibold">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        >
          <NavArrowRight className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, currentMonth)
          const isBooked = isDateBooked(day)
          const isPast = isDatePast(day)
          const isDisabled = isDateDisabled(day)
          const isSelected = selectedDate && isSameDay(day, selectedDate)

          return (
            <button
              key={idx}
              onClick={() => !isDisabled && onSelectDate(day)}
              disabled={isDisabled}
              className={`
                aspect-square p-2 rounded-lg text-sm transition-colors
                ${!isCurrentMonth && 'text-gray-300'}
                ${isCurrentMonth && !isDisabled && 'hover:bg-rose-100'}
                ${isSelected && 'bg-rose-500 text-white hover:bg-rose-600'}
                ${isBooked && !isSelected && 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                ${isPast && !isBooked && !isSelected && 'text-gray-300 cursor-not-allowed'}
                ${!isDisabled && !isSelected && 'cursor-pointer'}
              `}
            >
              {format(day, 'd')}
            </button>
          )
        })}
      </div>

      <div className="mt-4 flex items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-rose-500 rounded"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-200 rounded"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-gray-300 rounded"></div>
          <span>Available</span>
        </div>
      </div>

      {loading && (
        <div className="absolute inset-0 bg-white/50 flex items-center justify-center rounded-lg">
          <div className="text-gray-600">Loading availability...</div>
        </div>
      )}
    </Card>
  )
}
