"use client"

import { Slider } from "@/components/ui/slider"
import { timeValues } from '../utils/timeUtils'

interface ExponentialTimeSliderProps {
  selectedTime: number;
  setSelectedTime: (time: number) => void;
}

export function ExponentialTimeSlider({ selectedTime, setSelectedTime }: ExponentialTimeSliderProps) {
  const handleSliderChange = (value: number[]) => {
    const index = Math.round(value[0])
    setSelectedTime(timeValues[index])
  }

  return (
    <div className="w-full max-w-sm space-y-4">
      <div className="text-center font-medium">
      </div>
      <Slider
        min={0}
        max={timeValues.length - 1}
        step={1}
        value={[timeValues.indexOf(selectedTime)]}
        onValueChange={handleSliderChange}
      />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>1 min</span>
        <span>1 month</span>
      </div>
    </div>
  )
}

