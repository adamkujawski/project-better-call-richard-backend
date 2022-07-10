import { NewFaultEntity} from "./fault-entity";
import { FieldPacket } from "mysql2";

export type FaultRestults = [NewFaultEntity[], FieldPacket[]];
