"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DateTimePicker } from "@/components/ui/date-time-picker";

import { createReservationSchema, CreateReservationForm } from "@/lib/validations";
import { ReservationService } from "@/lib/reservationService";

interface ReservationFormProps {
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function ReservationForm({ onSuccess, trigger }: ReservationFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<CreateReservationForm>({
    resolver: zodResolver(createReservationSchema),
    defaultValues: {
      title: "",
      description: "",
      reservedBy: "",
      room: "salinha",
      startTime: undefined,
      endTime: undefined,
    },
  });

  const onSubmit = async (data: CreateReservationForm) => {
    setIsSubmitting(true);
    
    try {
      // Check for time conflicts
      const hasConflict = await ReservationService.checkTimeConflict(
        data.startTime,
        data.endTime,
        data.room
      );
      
      if (hasConflict) {
        toast.error("Conflito de horário detectado. Por favor, escolha um horário diferente.");
        return;
      }

      await ReservationService.createReservation(data);
      toast.success("Reserva criada com sucesso!");
      
      reset();
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao criar reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  const defaultTrigger = (
    <Button className="w-full sm:w-auto animate-bounce cursor-pointer">
      <CalendarIcon className="mr-2 h-4 w-4" />
      Nova Reserva
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Nova Reserva</DialogTitle>
          <DialogDescription>
            Reserve a salinha para sua reunião ou sessão de estudo.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              placeholder="Título da reunião ou objetivo"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição (Opcional)</Label>
            <Input
              id="description"
              placeholder="Detalhes adicionais sobre a reserva"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reservedBy">Reservado Por</Label>
            <Input
              id="reservedBy"
              placeholder="Seu nome"
              {...register("reservedBy")}
            />
            {errors.reservedBy && (
              <p className="text-sm text-destructive">{errors.reservedBy.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="room">Sala</Label>
            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma sala" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="salinha">Salinha</SelectItem>
                    <SelectItem value="sede">Sede</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.room && (
              <p className="text-sm text-destructive">{errors.room.message}</p>
            )}
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-orange-600">Data e Hora de Início</Label>
              <p className="text-xs text-muted-foreground">Quando sua reserva começa</p>
              <Controller
                name="startTime"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <DateTimePicker
                    {...field}
                    value={value}
                    onChange={onChange}
                    placeholder="Selecione data e hora de início"
                  />
                )}
              />
              {errors.startTime && (
                <p className="text-sm text-destructive">{errors.startTime.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-orange-600">Data e Hora de Fim</Label>
              <p className="text-xs text-muted-foreground">Quando sua reserva termina</p>
              <Controller
                name="endTime"
                control={control}
                render={({ field: { value, onChange, ...field } }) => (
                  <DateTimePicker
                    {...field}
                    value={value}
                    onChange={onChange}
                    placeholder="Selecione data e hora de fim"
                  />
                )}
              />
              {errors.endTime && (
                <p className="text-sm text-destructive">{errors.endTime.message}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Criando..." : "Criar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
