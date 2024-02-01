import { Demographics } from "./demographics.model"
import { Score } from "./scoreQuestion.model"

export interface Department {
    name: string,
    city: string,
    totalDepartmentScore: number,
    evaluationsCount: number,
    averageScores: Score[],
    demographics: Demographics
}