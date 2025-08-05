"use client";

import * as React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, Clock } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DateTimePickerProps {
  value?: Date;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function DateTimePicker(props: DateTimePickerProps) {
  const { value, onChange, placeholder = "Escolha uma data e hora", disabled = false } = props;
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(value);
  const [timeValue, setTimeValue] = React.useState(
    value ? format(value, "HH:mm") : ""
  );

  React.useEffect(() => {
    if (value) {
      setSelectedDate(value);
      setTimeValue(format(value, "HH:mm", { locale: ptBR }));
    }
  }, [value]);

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) {
      setSelectedDate(undefined);
      setTimeValue("");
      onChange(undefined);
      return;
    }

    setSelectedDate(date);
    
    // If we have a time, combine it with the new date
    if (timeValue) {
      const [hours, minutes] = timeValue.split(":").map(Number);
      const newDateTime = new Date(date);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime);
    } else {
      // Default to current time or 9 AM if no time set
      const now = new Date();
      const newDateTime = new Date(date);
      newDateTime.setHours(now.getHours(), now.getMinutes(), 0, 0);
      setTimeValue(format(newDateTime, "HH:mm", { locale: ptBR }));
      onChange(newDateTime);
    }
  };

  const handleTimeChange = (time: string) => {
    setTimeValue(time);
    
    if (selectedDate && time) {
      const [hours, minutes] = time.split(":").map(Number);
      const newDateTime = new Date(selectedDate);
      newDateTime.setHours(hours, minutes, 0, 0);
      onChange(newDateTime);
    }
  };

  const handleClear = () => {
    setSelectedDate(undefined);
    setTimeValue("");
    onChange(undefined);
    setIsOpen(false);
  };

  const handleNow = () => {
    const now = new Date();
    setSelectedDate(now);
    setTimeValue(format(now, "HH:mm", { locale: ptBR }));
    onChange(now);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP 'às' HH:mm", { locale: ptBR }) : placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="space-y-4 p-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Selecionar Data</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              initialFocus
              classNames={{
                today: "border-2 border-orange-500 bg-orange-50 text-orange-900 rounded-md data-[selected=true]:border-orange-600 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground"
              }}
            />
          </div>
          
          {selectedDate && (
            <div className="space-y-2 border-t pt-4">
              <Label htmlFor="time" className="text-sm font-medium">
                Selecionar Hora
              </Label>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={timeValue}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          )}
          
          <div className="flex space-x-2 border-t pt-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handleNow}
              className="flex-1 cursor-pointer"
            >
              Agora
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              className="flex-1 cursor-pointer"
            >
              Limpar
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
