import { Department } from "./department.model";
import { Demographics } from "./demographics.model";

export interface City{
    name: string,
    departments: Department[],
    cityScore: number,
    evaluationsCount: number,
    demographics: Demographics
}