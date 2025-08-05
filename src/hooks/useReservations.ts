"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Reservation } from "@/types/reservation";
import { ReservationService } from "@/lib/reservationService";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });
      
      const dataPromise = ReservationService.getAllReservations();
      
      const data = await Promise.race([dataPromise, timeoutPromise]) as Reservation[];
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reservations");
      // Set empty array on error so the UI can show empty state
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const createReservation = async (data: Parameters<typeof ReservationService.createReservation>[0]) => {
    try {
      await ReservationService.createReservation(data);
      await fetchReservations(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reservation");
      return false;
    }
  };

  const updateReservation = async (id: string, data: Parameters<typeof ReservationService.updateReservation>[1]) => {
    try {
      await ReservationService.updateReservation(id, data);
      await fetchReservations(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update reservation");
      return false;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await ReservationService.deleteReservation(id);
      await fetchReservations(); // Refresh the list
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete reservation");
      return false;
    }
  };

  return {
    reservations,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchReservations,
  };
}

export function useReservationsByDate(date: Date) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReservationsByDate = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Add a timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error("Request timed out")), 10000);
        });
        
        const dataPromise = ReservationService.getReservationsByDate(date);
        
        const data = await Promise.race([dataPromise, timeoutPromise]) as Reservation[];
        setReservations(data);
      } catch (err) {
        console.error("Error fetching reservations by date:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch reservations");
        // Set empty array on error so the UI can show empty state
        setReservations([]);
      } finally {
        setLoading(false);
      }
    };

    fetchReservationsByDate();
  }, [date]);

  const refetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });
      
      const dataPromise = ReservationService.getReservationsByDate(date);
      
      const data = await Promise.race([dataPromise, timeoutPromise]) as Reservation[];
      setReservations(data);
    } catch (err) {
      console.error("Error refetching reservations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reservations");
      setReservations([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    reservations,
    loading,
    error,
    refetch,
  };
}

export function useTodayReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const today = useMemo(() => new Date(), []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Add a timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Request timed out")), 10000);
      });
      
      // Fetch today's reservations and total count in parallel
      const [todayReservationsPromise, totalCountPromise] = [
        ReservationService.getReservationsByDateOptimized(today),
        ReservationService.getTotalReservationsCount()
      ];
      
      const [todayReservations, totalCountResult] = await Promise.all([
        Promise.race([todayReservationsPromise, timeoutPromise]) as Promise<Reservation[]>,
        Promise.race([totalCountPromise, timeoutPromise]) as Promise<number>
      ]);
      
      setReservations(todayReservations);
      setTotalCount(totalCountResult);
    } catch (err) {
      console.error("Error fetching today's reservations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch reservations");
      // Set empty array on error so the UI can show empty state
      setReservations([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [today]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const createReservation = async (data: Parameters<typeof ReservationService.createReservation>[0]) => {
    try {
      await ReservationService.createReservation(data);
      await fetchData(); // Refresh the data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create reservation");
      return false;
    }
  };

  const updateReservation = async (id: string, data: Parameters<typeof ReservationService.updateReservation>[1]) => {
    try {
      await ReservationService.updateReservation(id, data);
      await fetchData(); // Refresh the data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update reservation");
      return false;
    }
  };

  const deleteReservation = async (id: string) => {
    try {
      await ReservationService.deleteReservation(id);
      await fetchData(); // Refresh the data
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete reservation");
      return false;
    }
  };

  return {
    todayReservations: reservations,
    totalReservationsCount: totalCount,
    loading,
    error,
    createReservation,
    updateReservation,
    deleteReservation,
    refetch: fetchData,
  };
}
