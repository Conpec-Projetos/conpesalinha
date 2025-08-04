import { Timestamp } from "firebase/firestore";

export type Room = "salinha" | "sede";

export interface Reservation {
  id: string;
  title: string;
  description?: string;
  startTime: Timestamp;
  endTime: Timestamp;
  reservedBy: string;
  room: Room;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CreateReservationData {
  title: string;
  description?: string;
  startTime: Date;
  endTime: Date;
  reservedBy: string;
  room: Room;
}

export interface UpdateReservationData {
  title?: string;
  description?: string;
  startTime?: Date;
  endTime?: Date;
  reservedBy?: string;
  room?: Room;
}
