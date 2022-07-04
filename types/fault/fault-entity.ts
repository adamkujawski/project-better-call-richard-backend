import { Fault } from "../../records/fault.record";

export interface NewFaultEntity {
  id?: string;
  name: string;
  surname: string;
  telephone: string;
  email: string;
  brand: string;
  model: string;
  registration_no: string;
  year: number;
  type_fuel: string;
  capacity: number;
  description: string;
  status?: string;
  code?: string;
  pricing?: number;
  accept?: boolean;
  arrival_date?: Date;
  finish_date?: Date;
  created_at?: Date;
  updated_at?: Date;
}

export interface FaultEntity {
  id?: string;
  name: string;
  surname: string;
  telephone: string;
  email: string;
  brand: string;
  model: string;
  registrationNo: string;
  year: number;
  typeFuel: string;
  capacity: number;
  description: string;
  status?: string;
  code?: string;
  pricing?: number;
  accept?: boolean;
  arrivalDate?: Date;
  finishDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
  addPricing?: (pricing: number, date: Date) => void;
  changeStatus?: () => void;
  finishStatus?: () => void;
}
