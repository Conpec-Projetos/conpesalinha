import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
  where,
  getCountFromServer,
} from "firebase/firestore";
import { db } from "./firebase";
import { Reservation, CreateReservationData, UpdateReservationData } from "@/types/reservation";

const COLLECTION_NAME = "reservations";

export class ReservationService {
  /**
   * Create a new reservation
   */
  static async createReservation(data: CreateReservationData): Promise<string> {
    try {
      const now = Timestamp.now();
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...data,
        startTime: Timestamp.fromDate(data.startTime),
        endTime: Timestamp.fromDate(data.endTime),
        createdAt: now,
        updatedAt: now,
      });
      return docRef.id;
    } catch (error) {
      console.error("Error creating reservation:", error);
      throw new Error("Failed to create reservation");
    }
  }

  /**
   * Get all reservations ordered by start time
   */
  static async getAllReservations(): Promise<Reservation[]> {
    try {
      const q = query(
        collection(db, COLLECTION_NAME),
        orderBy("startTime", "asc")
      );
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];
    } catch (error) {
      console.error("Error fetching reservations:", error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes("permission-denied")) {
          throw new Error("Database access denied. Please check Firebase security rules.");
        }
        if (error.message.includes("unavailable")) {
          throw new Error("Database is temporarily unavailable. Please try again.");
        }
        if (error.message.includes("network")) {
          throw new Error("Network error. Please check your internet connection.");
        }
      }
      
      throw new Error("Failed to fetch reservations. Please try again.");
    }
  }

  /**
   * Get reservations for a specific date with optimized Firestore query
   */
  static async getReservationsByDateOptimized(date: Date): Promise<Reservation[]> {
    try {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Use optimized query to fetch only today's reservations
      const q = query(
        collection(db, COLLECTION_NAME),
        where("startTime", ">=", Timestamp.fromDate(startOfDay)),
        where("startTime", "<=", Timestamp.fromDate(endOfDay)),
        orderBy("startTime", "asc")
      );
      
      const querySnapshot = await getDocs(q);
      
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })) as Reservation[];
    } catch (error) {
      console.error("Error fetching reservations by date (optimized):", error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes("permission-denied")) {
          throw new Error("Database access denied. Please check Firebase security rules.");
        }
        if (error.message.includes("unavailable")) {
          throw new Error("Database is temporarily unavailable. Please try again.");
        }
        if (error.message.includes("network")) {
          throw new Error("Network error. Please check your internet connection.");
        }
      }
      
      throw new Error("Failed to fetch reservations. Please try again.");
    }
  }

  /**
   * Get total count of all reservations efficiently
   */
  static async getTotalReservationsCount(): Promise<number> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const snapshot = await getCountFromServer(q);
      return snapshot.data().count;
    } catch (error) {
      console.error("Error getting total reservations count:", error);
      throw new Error("Failed to get reservations count");
    }
  }

  /**
   * Get reservations for a specific date
   */
  static async getReservationsByDate(date: Date): Promise<Reservation[]> {
    try {
      // Fetch all reservations and filter by date in-memory to avoid index requirements
      const allReservations = await this.getAllReservations();
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      // Filter reservations for the specific date
      const dayReservations = allReservations.filter(reservation => {
        const resStart = reservation.startTime.toDate();
        return resStart >= startOfDay && resStart <= endOfDay;
      });

      // Sort by start time (already sorted from getAllReservations, but ensuring order)
      return dayReservations.sort((a, b) => 
        a.startTime.toDate().getTime() - b.startTime.toDate().getTime()
      );
    } catch (error) {
      console.error("Error fetching reservations by date:", error);
      
      // More specific error messages
      if (error instanceof Error) {
        if (error.message.includes("permission-denied")) {
          throw new Error("Database access denied. Please check Firebase security rules.");
        }
        if (error.message.includes("unavailable")) {
          throw new Error("Database is temporarily unavailable. Please try again.");
        }
        if (error.message.includes("network")) {
          throw new Error("Network error. Please check your internet connection.");
        }
      }
      
      throw new Error("Failed to fetch reservations. Please try again.");
    }
  }

  /**
   * Update an existing reservation
   */
  static async updateReservation(id: string, data: UpdateReservationData): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const updateFields: Record<string, Timestamp | string | undefined> = {
        updatedAt: Timestamp.now(),
      };

      // Add fields that exist in the data
      if (data.title !== undefined) updateFields.title = data.title;
      if (data.description !== undefined) updateFields.description = data.description;
      if (data.reservedBy !== undefined) updateFields.reservedBy = data.reservedBy;
      
      // Convert dates to Timestamps if provided
      if (data.startTime) {
        updateFields.startTime = Timestamp.fromDate(data.startTime);
      }
      if (data.endTime) {
        updateFields.endTime = Timestamp.fromDate(data.endTime);
      }

      await updateDoc(docRef, updateFields);
    } catch (error) {
      console.error("Error updating reservation:", error);
      throw new Error("Failed to update reservation");
    }
  }

  /**
   * Delete a reservation
   */
  static async deleteReservation(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting reservation:", error);
      throw new Error("Failed to delete reservation");
    }
  }

  /**
   * Check if there's a time conflict with existing reservations
   */
  static async checkTimeConflict(
    startTime: Date,
    endTime: Date,
    room: string,
    excludeId?: string
  ): Promise<boolean> {
    try {
      // Fetch all reservations and check conflicts in-memory to avoid composite index requirement
      const allReservations = await this.getAllReservations();
      
      // Check for overlapping time periods in the same room
      const conflicts = allReservations.filter(reservation => {
        // Skip if this is the reservation we're excluding (for updates)
        if (excludeId && reservation.id === excludeId) {
          return false;
        }
        
        // Only check conflicts for the same room
        if (reservation.room !== room) {
          return false;
        }
        
        const resStart = reservation.startTime.toDate();
        const resEnd = reservation.endTime.toDate();
        
        // Check if time periods overlap
        // Two time periods overlap if: start1 < end2 AND end1 > start2
        return startTime < resEnd && endTime > resStart;
      });
      
      return conflicts.length > 0;
    } catch (error) {
      console.error("Error checking time conflict:", error);
      throw new Error("Failed to check time conflict");
    }
  }
}
