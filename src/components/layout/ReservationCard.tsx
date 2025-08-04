"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock, User, Edit2, Trash2, MapPin } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Reservation } from "@/types/reservation";
import { ReservationService } from "@/lib/reservationService";
import { EditReservationForm } from "@/components/forms/EditReservationForm";

interface ReservationCardProps {
  reservation: Reservation;
  onUpdate?: () => void;
  showActions?: boolean;
}

export function ReservationCard({ 
  reservation, 
  onUpdate, 
  showActions = true 
}: ReservationCardProps) {
  const handleDelete = async () => {
    try {
      await ReservationService.deleteReservation(reservation.id);
      toast.success("Reserva excluída com sucesso");
      onUpdate?.();
    } catch {
      toast.error("Falha ao excluir reserva");
    }
  };

  const startTime = reservation.startTime.toDate();
  const endTime = reservation.endTime.toDate();
  const now = new Date();
  const isActive = startTime <= now && endTime >= now;
  const isPast = endTime < now;

  return (
    <Card className={`transition-colors ${
      isActive ? "border-primary bg-primary/5" : 
      isPast ? "border-muted bg-muted/50" : 
      "border-border"
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg flex items-center gap-2">
              {reservation.title}
              {isActive && (
                <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded-full">
                  Ativa
                </span>
              )}
            </CardTitle>
            {reservation.description && (
              <CardDescription className="text-sm">
                {reservation.description}
              </CardDescription>
            )}
          </div>
          {showActions && !isPast && (
            <div className="flex gap-1">
              <EditReservationForm
                reservation={reservation}
                onSuccess={onUpdate}
                trigger={
                  <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                    <Edit2 className="h-3 w-3" />
                    <span className="sr-only">Editar reserva</span>
                  </Button>
                }
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-3 w-3" />
                    <span className="sr-only">Excluir reserva</span>
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir Reserva</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza de que deseja excluir &ldquo;{reservation.title}&rdquo;? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{format(startTime, "EEEE, d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>
              {format(startTime, "HH:mm", { locale: ptBR })} - {format(endTime, "HH:mm", { locale: ptBR })}
              {" "}({Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60))} min)
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span>
              {reservation.room === "salinha" ? "Salinha" : "Sede"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Reservado por {reservation.reservedBy}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
