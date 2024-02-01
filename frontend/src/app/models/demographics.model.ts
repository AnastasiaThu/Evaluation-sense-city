export interface Demographics{
  gender: {
    "Γυναίκα": number,
    "Άντρας": number
    },
  ageGroup: {
    "18-25": number,
    "25-35": number,
    "35-45": number,
    "45-60": number,
    ">60":number,
    },
  educationLevel: {
    "Φοιτητής": number,
    "employee": number,
    "unemployed": number,
    },
  contact: {
    "Γνωστός": number,
    "Διαδίκτυο": number,
    "Άλλο": number,
    },
}