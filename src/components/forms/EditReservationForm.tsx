"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Reservation } from "@/types/reservation";

interface EditReservationFormProps {
  reservation: Reservation;
  onSuccess?: () => void;
  trigger?: React.ReactNode;
}

export function EditReservationForm({ reservation, onSuccess, trigger }: EditReservationFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
    setValue,
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

  // Populate form with existing reservation data
  useEffect(() => {
    if (reservation && open) {
      setValue("title", reservation.title);
      setValue("description", reservation.description || "");
      setValue("reservedBy", reservation.reservedBy);
      setValue("room", reservation.room);
      setValue("startTime", reservation.startTime.toDate());
      setValue("endTime", reservation.endTime.toDate());
    }
  }, [reservation, open, setValue]);

  const onSubmit = async (data: CreateReservationForm) => {
    setIsSubmitting(true);
    
    try {
      // Check for time conflicts, excluding the current reservation
      const hasConflict = await ReservationService.checkTimeConflict(
        data.startTime,
        data.endTime,
        data.room,
        reservation.id
      );
      
      if (hasConflict) {
        toast.error("Conflito de horário detectado. Por favor, escolha um horário diferente.");
        return;
      }

      await ReservationService.updateReservation(reservation.id, {
        title: data.title,
        description: data.description,
        reservedBy: data.reservedBy,
        startTime: data.startTime,
        endTime: data.endTime,
      });
      
      toast.success("Reserva atualizada com sucesso!");
      
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Falha ao atualizar reserva");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Reserva</DialogTitle>
          <DialogDescription>
            Atualize os detalhes da sua reserva da salinha.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Título</Label>
            <Input
              id="edit-title"
              placeholder="Título da reunião ou objetivo"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição (Opcional)</Label>
            <Input
              id="edit-description"
              placeholder="Detalhes adicionais sobre a reserva"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-reservedBy">Reservado Por</Label>
            <Input
              id="edit-reservedBy"
              placeholder="Seu nome"
              {...register("reservedBy")}
            />
            {errors.reservedBy && (
              <p className="text-sm text-destructive">{errors.reservedBy.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-room">Sala</Label>
            <Controller
              name="room"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              onClick={handleCancel}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Atualizando..." : "Atualizar Reserva"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
