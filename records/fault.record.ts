import { FaultEntity, NewFaultEntity } from "../types/fault/fault-entity";
import { pool } from "../utils/db";
import { v4 as uuid } from "uuid";
import { FaultRestults } from "../types/fault/faults-results";
import { send } from "../utils/nodemailer";
import { ValidationError } from "../utils/errors";

export class Fault implements FaultEntity {
  public id: string;
  public name: string;
  public surname: string;
  public telephone: string;
  public email: string;
  public brand: string;
  public model: string;
  public registrationNo: string;
  public year: number;
  public typeFuel: string;
  public capacity: number;
  public description: string;
  public status: string;
  public code: string;
  public pricing: number;
  public accept: boolean;
  public arrivalDate: Date;
  public finishDate: Date;
  public createdAt: Date;
  public updatedAt: Date;

  constructor(obj: NewFaultEntity) {
    if (!obj.name || obj.name.length > 13) {
      throw new ValidationError(
        "Imię nie może być puste ani zawierać wiecej niz 13 znaków!"
      );
    }
    if (!obj.surname || obj.surname.length > 28) {
      throw new ValidationError(
        "Nazwisko nie może być puste ani zawierać wiecej niz 28 znaków!"
      );
    }
    if (!obj.telephone || obj.telephone.length > 13) {
      throw new ValidationError(
        "Nr telefonu nie może być pusty ani zawierać wiecej niz 11 znaków!"
      );
    }
    if (!obj.email || obj.email.length > 63) {
      throw new ValidationError(
        "Adres e-mail nie może być pusty ani zawierać wiecej niz 63 znaków!"
      );
    }
    if (!obj.brand || obj.brand.length > 20) {
      throw new ValidationError(
        "Marka auta nie może być pusta ani zawierać wiecej niz 20 znaków!"
      );
    }
    if (!obj.model || obj.model.length > 20) {
      throw new ValidationError(
        "Model auta nie może być pusty ani zawierać wiecej niz 20 znaków!"
      );
    }
    if (!obj.registration_no || obj.registration_no.length > 13) {
      throw new ValidationError(
        "Nr rejestracyjny nie może być pusty ani zawierać wiecej niz 9 znaków!"
      );
    }
    if (!obj.year) {
      throw new ValidationError("Rok nie może być pusty!");
    }
    if (!obj.type_fuel || obj.type_fuel.length > 11) {
      throw new ValidationError(
        "Rodzaj paliwa nie może być pusty ani zawierać wiecej niż 10 znaków"
      );
    }
    if (!obj.capacity || obj.capacity.toString().length > 5) {
      throw new ValidationError(
        "Pojemność auta nie może być pusta, ani zawierać wiecej niż 5 znaków"
      );
    }
    if (!obj.description || obj.description.length > 1024) {
      throw new ValidationError(
        "Opis usterki nie może być pusty, ani zawierać wiecej niż 1024 znaki"
      );
    }

    this.id = obj.id;
    this.name = obj.name;
    this.surname = obj.surname;
    this.telephone = obj.telephone;
    this.email = obj.email;
    this.brand = obj.brand;
    this.model = obj.model;
    this.registrationNo = obj.registration_no;
    this.year = obj.year;
    this.typeFuel = obj.type_fuel;
    this.capacity = obj.capacity;
    this.description = obj.description;
    this.status = obj.status ?? "new";
    this.code = obj.code;
    this.pricing = obj.pricing ?? 0;
    this.accept = obj.accept ?? false;
    this.arrivalDate = obj.arrival_date ?? null;
    this.finishDate = obj.finish_date ?? null;
    this.createdAt = obj.created_at ?? new Date();
    this.updatedAt = obj.updated_at ?? new Date();
  }

  async addNewFault(): Promise<string> {
    if (!this.id) {
      this.id = uuid();
      this.code = this.id.slice(-5);
    } else {
      throw new Error("Cannot insert something what still exist");
    }
    console.log('wszedlem do metody')

    await pool.execute(
      "INSERT INTO `faults` VALUES(:id, :name, :surname, :telephone, :email,  :brand, :model, :registration_no, :year, :type_fuel, :capacity, :description, :status, :code, :pricing, :accept, :arrival_date, :finish_date, :createdAt, :updatedAt)",
      {
        id: this.id,
        name: this.name,
        surname: this.surname,
        telephone: this.telephone,
        email: this.email,
        brand: this.brand,
        model: this.model,
        registration_no: this.registrationNo,
        year: this.year,
        type_fuel: this.typeFuel,
        capacity: this.capacity,
        description: this.description,
        status: this.status,
        code: this.code,
        pricing: this.pricing,
        accept: this.accept,
        arrival_date: this.arrivalDate,
        finish_date: this.finishDate,
        createdAt: this.createdAt,
        updatedAt: this.updatedAt,
      }
    );

    const subject = `Zgłoszenie naprawy auta: ${this.brand} ${this.model} ${this.registrationNo}`;
    const html =
      "<body>" +
      "<h1>Cześć!</h1>" +
      "<p>Dziękuje za zgłoszenie, niebawem postaram sie przesłąć wstępną wycenę</p>" +
      "<p>Pozdrawiam,</p>" +
      "<p>Richard</p>" +
      "</body>";

    await send(
      this.email,
      this.brand,
      this.model,
      this.registrationNo,
      subject,
      html
    );

    return this.id;
  }

  async addPricing(pricing: number, arrivalDate: Date): Promise<void> {
    console.log(this.id);
    await pool.execute(
      "UPDATE `faults` SET `pricing` = :pricing, `arrival_date` = :arrival_date, `status` = :status  WHERE `id` = :id",
      {
        id: this.id,
        pricing: pricing,
        arrival_date: arrivalDate,
        status: "waiting",
      }
    );

    const subject = `Wstępna wycena naprawy auta: ${this.brand} ${this.model} ${this.registrationNo}`;
    const html =
      "<body>" +
      "<h1>Cześć!</h1>" +
      "<p>Dziękuje za zgłoszenie, poniżej przesyłam wstępna wycenę:</p>" +
      `<p>Wstępna cena naprawy auta: ${pricing} zł, auto można przywieźć dnia ${arrivalDate}.</p>` +
      `<p>Cena naprawy jest orientacyjna, ostateczną cene ustalimy po przejeździe i wstępnych oględzinach.</p>` +
      `<p>Jeżeli potwierdzasz datę przyjazdu i koszty, proszę kliknij w poniższy link.</p>` +
      `<a href='https://bettercallrichard.networkmanager.pl/api/fault/accept/${this.id}' target='_blank' style='text-decoration: none; padding: 10px 3px;border: 1px solid black; border-radius: 15%;'>ZGADZAM SIĘ</a>` +
      "<p>Pozdrawiam,</p>" +
      "<p>Richard</p>" +
      "</body>";

    await send(
      this.email,
      this.brand,
      this.model,
      this.registrationNo,
      subject,
      html
    );
  }

  async changeStatus(): Promise<void> {
    await pool.execute(
      "UPDATE `faults` SET `accept`=:accept, `status` = :status WHERE `id` = :id",
      {
        id: this.id,
        accept: "yes",
        status: "accepted",
      }
    );
  }

  async finishStatus():Promise<void>{
    console.log(this.id)
    await pool.execute(
        "UPDATE `faults` SET `status` = 'finished', `finish_date`= :finishDate WHERE `id` = :id",
        {
          id: this.id,
          finishDate: new Date(),
        }
    );
  }

  static async getNewFaults(): Promise<FaultEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `status` = 'new'"
    )) as FaultRestults;

    return results.length === 0
      ? null
      : results.map((record) => new Fault(record));
  }

  static async getWaitingFaults(): Promise<FaultEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `status` = 'waiting'"
    )) as FaultRestults;

    return results.length === 0
      ? null
      : results.map((record) => new Fault(record));
  }

  static async getFinishedFaults(): Promise<FaultEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `status` = 'finished'"
    )) as FaultRestults;

    return results.length === 0
      ? null
      : results.map((record) => new Fault(record));
  }
  static async getAcceptedFaults(): Promise<FaultEntity[]> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `status` = 'accepted'"
    )) as FaultRestults;

    return results.length === 0
      ? null
      : results.map((record) => new Fault(record));
  }

  static async getOneWithCode(code: string): Promise<FaultEntity | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `code` = :code ",
      {
        code,
      }
    )) as FaultRestults;

    return results.length === 0 ? null : new Fault(results[0]);
  }

  static async getOneWithId(id: string): Promise<FaultEntity | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `id` = :id ",
      {
        id,
      }
    )) as FaultRestults;

    return results.length === 0 ? null : new Fault(results[0]);
  }

  static async getAllFaults(): Promise<FaultEntity[] | null> {
    const [results] = (await pool.execute(
      "SELECT * FROM `faults` WHERE `status` != 'finished'"
    )) as FaultRestults;

    return results.length === 0
      ? null
      : results.map((record) => new Fault(record));
  }
}
