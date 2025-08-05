"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon, Plus, Users, MapPin } from "lucide-react";
import { useMemo } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { ReservationForm } from "@/components/forms/ReservationForm";
import { ReservationCard } from "@/components/layout/ReservationCard";
import { useTodayReservations } from "@/hooks/useReservations";

export function Dashboard() {
  const { 
    todayReservations, 
    totalReservationsCount, 
    loading, 
    error, 
    refetch 
  } = useTodayReservations();

  // Memoize filtered reservations by room and time
  const roomData = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    
    const salinhaReservations = todayReservations.filter(r => r.room === "salinha");
    const sedeReservations = todayReservations.filter(r => r.room === "sede");
    
    const getSalinhaData = () => {
      const current = salinhaReservations.find(
        (r) => r.startTime.toDate() <= now && r.endTime.toDate() >= now
      );
      const upcoming = salinhaReservations
        .filter((r) => r.startTime.toDate() > now)
        .sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime());
      // Only show past reservations that started today and have already ended
      const past = salinhaReservations
        .filter((r) => 
          r.startTime.toDate() >= todayStart && 
          r.startTime.toDate() <= todayEnd && 
          r.endTime.toDate() < now
        )
        .sort((a, b) => b.startTime.toDate().getTime() - a.startTime.toDate().getTime());
      return { current, upcoming, past, todayCount: salinhaReservations.length };
    };
    
    const getSedeData = () => {
      const current = sedeReservations.find(
        (r) => r.startTime.toDate() <= now && r.endTime.toDate() >= now
      );
      const upcoming = sedeReservations
        .filter((r) => r.startTime.toDate() > now)
        .sort((a, b) => a.startTime.toDate().getTime() - b.startTime.toDate().getTime());
      // Only show past reservations that started today and have already ended
      const past = sedeReservations
        .filter((r) => 
          r.startTime.toDate() >= todayStart && 
          r.startTime.toDate() <= todayEnd && 
          r.endTime.toDate() < now
        )
        .sort((a, b) => b.startTime.toDate().getTime() - a.startTime.toDate().getTime());
      return { current, upcoming, past, todayCount: sedeReservations.length };
    };
    
    return {
      salinha: getSalinhaData(),
      sede: getSedeData()
    };
  }, [todayReservations]);

  const handleRefresh = () => {
    refetch();
  };

  // Calculate stats
  const todayCount = todayReservations.length;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Salinha Reservations
            </h1>
            <p className="text-muted-foreground mt-1">
              How to reservation :)
            </p>
          </div>
          <ReservationForm onSuccess={handleRefresh} />
        </div>

        {/* Room Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Salinha Status */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Salinha
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    roomData.salinha.current ? "bg-primary" : "bg-green-500"
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {roomData.salinha.current ? "Ocupada" : "Disponível"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {roomData.salinha.current 
                      ? `Até ${format(roomData.salinha.current.endTime.toDate(), "HH:mm", { locale: ptBR })}`
                      : "Pronta para uso"
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roomData.salinha.todayCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {roomData.salinha.upcoming.length} próximas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Sede Status */}
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Sede
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Status</CardTitle>
                  <div className={`w-3 h-3 rounded-full animate-pulse ${
                    roomData.sede.current ? "bg-primary" : "bg-green-500"
                  }`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {roomData.sede.current ? "Ocupada" : "Disponível"}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {roomData.sede.current 
                      ? `Até ${format(roomData.sede.current.endTime.toDate(), "HH:mm", { locale: ptBR })}`
                      : "Pronta para uso"
                    }
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reservas Hoje</CardTitle>
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{roomData.sede.todayCount}</div>
                  <p className="text-xs text-muted-foreground">
                    {roomData.sede.upcoming.length} próximas
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Reservas Hoje</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayCount}</div>
              <p className="text-xs text-muted-foreground">
                Ambas as salas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Geral</CardTitle>
              <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalReservationsCount}</div>
              <p className="text-xs text-muted-foreground">
                Todas as reservas
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Active Reservations */}
        {(roomData.salinha.current || roomData.sede.current) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-ping opacity-75" />
              Atualmente Ativas
            </h2>
            <div className="grid gap-4">
              {roomData.salinha.current && (
                <ReservationCard 
                  reservation={roomData.salinha.current} 
                  onUpdate={handleRefresh}
                  showActions={true}
                />
              )}
              {roomData.sede.current && (
                <ReservationCard 
                  reservation={roomData.sede.current} 
                  onUpdate={handleRefresh}
                  showActions={true}
                />
              )}
            </div>
          </div>
        )}

        {/* Upcoming Reservations */}
        {(roomData.salinha.upcoming.length > 0 || roomData.sede.upcoming.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Próximas Hoje</h2>
            <div className="space-y-6">
              {roomData.salinha.upcoming.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Salinha
                  </h3>
                  <div className="grid gap-4">
                    {roomData.salinha.upcoming.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onUpdate={handleRefresh}
                      />
                    ))}
                  </div>
                </div>
              )}
              {roomData.sede.upcoming.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Sede
                  </h3>
                  <div className="grid gap-4">
                    {roomData.sede.upcoming.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onUpdate={handleRefresh}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Past Reservations Today */}
        {(roomData.salinha.past.length > 0 || roomData.sede.past.length > 0) && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Anteriores Hoje</h2>
            <div className="space-y-6">
              {roomData.salinha.past.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Salinha
                  </h3>
                  <div className="grid gap-4">
                    {roomData.salinha.past.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onUpdate={handleRefresh}
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>
              )}
              {roomData.sede.past.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Sede
                  </h3>
                  <div className="grid gap-4">
                    {roomData.sede.past.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        onUpdate={handleRefresh}
                        showActions={false}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <div className="mx-auto h-12 w-12 text-destructive mb-4">⚠️</div>
            <h3 className="text-lg font-medium mb-2">Erro de Conexão</h3>
            <p className="text-muted-foreground mb-4">
              {error || "Não foi possível conectar ao banco de dados"}
            </p>
            <div className="space-x-2">
              <Button onClick={handleRefresh} className="cursor-pointer" variant="outline">
                Tentar Novamente
              </Button>
              <ReservationForm 
                onSuccess={handleRefresh}
                trigger={<Button className="cursor-pointer">Continuar Mesmo Assim</Button>}
              />
            </div>
          </div>
        )}

        {/* Loading State - Only show if no errors and actually loading */}
        {loading && !error && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="text-muted-foreground mt-4">Carregando reservas...</p>
          </div>
        )}

        {/* Empty State - Only show if not loading and no errors */}
        {!loading && !error && todayReservations.length === 0 && (
          <div className="text-center py-12">
            <CalendarIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Nenhuma reserva hoje</h3>
            <p className="text-muted-foreground mb-4">
              A salinha está completamente livre hoje. Seja o primeiro a reservá-la!
            </p>
            <ReservationForm 
              onSuccess={handleRefresh}
              trigger={
                <Button className="cursor-pointer">
                  <Plus className="mr-2 h-4 w-4" />
                  Fazer Primeira Reserva
                </Button>
              }
            />
          </div>
        )}
      </div>
    </div>
  );
}
