import { Dayjs } from "dayjs";

interface Entity {
  id: string;
  created: string;
  updated: string;
}

export interface Point {
  type: "Point";
  coordinates: [number, number];
}

export type NewOf<T extends Entity> = Omit<T, keyof Entity>;

export interface Duck extends Entity {
  name: string;
  image: string;
}

export interface Affiliate extends Entity {
  name: string;
  email: string;
  image: string;
  description: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
}

export interface Jeep extends Entity {
  name: string;
  model: string;
  image: string;
}

export interface Pet extends Entity {
  name: string;
  image: string | null;
}

export interface Member extends Entity {
  image: string;
  name: string;
  email: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  zip: string;
  affiliations: Affiliate[];
  ownedVehicles: Jeep[];
  pets: Pet[];
  isPublic: boolean;
}

export interface Comment extends Entity {
  author: Member;
  content: string;
}

export interface Post extends Entity {
  title: string;
  author: Member;
  comments: Comment[];
}

export interface Event extends Entity {
  name: string;
  image: string;
  location: Point;
  date: Dayjs;
}
