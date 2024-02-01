const mongoose = require('mongoose');
const { ScoringQuestion } = require('./model/scoringQuestion');
const { TextQuestion } = require('./model/textQuestion');
const { City } = require('./model/city');
const { Department } = require('./model/department');
const { Evaluation } = require('./model/evaluation');
const {Question} = require('./model/question');

const scoreOptions = [1,2,3,4,5];

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjxfjhn.mongodb.net/?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");
    

    //const questionsID = await createQuestions();
    if (await checkEmpty()) {

      // Initialize collections - generate dummy data
      const questionsID = await createQuestions();
      const scoringQuestionIds = await createScoringQuestions();
      const textQuestionIds = await createTextQuestions();
      const departmentIds = await createDepartments();
      await createCities(departmentIds);
      await createEvaluations(scoringQuestionIds, textQuestionIds, departmentIds);
    }

  } catch (error) {
    console.error(error);
  }
}

const checkEmpty = async () => {
  const scoringQEmpty = await ScoringQuestion.countDocuments() === 0;
  const textQEmpty = await TextQuestion.countDocuments() === 0;
  const departmentsEmpty = await Department.countDocuments() === 0;
  const citiesEmpty = await City.countDocuments() === 0;
  const evaluationsEmpty = await Evaluation.countDocuments() === 0;
  const questionsEmpty = await Question.countDocuments() === 0;

  return scoringQEmpty && textQEmpty && departmentsEmpty && citiesEmpty && evaluationsEmpty&& questionsEmpty;
}

const createQuestions = async () => {
  const dummyQuestions = [
    {
      description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος;', 
      label: 'Εξυπηρέτηση', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 1,
    },
    { 
      description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
      label: 'Χρόνος αποκατάστασης',
      type: 'scoring',
      scoreOptions: scoreOptions,
      required: true,	
      order: 2,
    },
    {
      description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
      label: 'Επικοινωνία',
      type: 'scoring',
      scoreOptions: scoreOptions,
      required: true,	
      order: 3,
    },
    {
      description: 'Πώς μάθατε για την υπηρεσία;',
      type: 'text',
      options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
      required: true,	
      order: 4,
    },
    {
      description: 'Επιλέξτε το φύλο σας',	
      type: 'text',
      options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
      required: false,	
      order: 5,
    },
    {
      description: 'Δώστε το έτος γέννησής σας',	
      type: 'date',
      required: false,	
      order: 6,
    },
    {
      description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',	
      type: 'text',
      options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
      required: false,	
      order: 7,
    },
    
  ]
  const result = await Question.insertMany(dummyQuestions);
  console.log('Questions created');
  return result.map(entry => entry._id);
};

const createScoringQuestions = async () => {
  const dummyScoringQuestions = [
    { question: 'ερώτηση 1', score: 4 },
    { question: 'ερώτηση 2', score: 3 },
  ];

  const result = await ScoringQuestion.insertMany(dummyScoringQuestions);
  console.log('Scoring questions created');
  return result.map(entry => entry._id);
};

const createTextQuestions = async () => {
  const dummyTextQuestions = [
    { question: 'Text Question 1', answer: 'Answer 1' },
    { question: 'Text Question 2', answer: 'Answer 2' },
  ];

  const result = await TextQuestion.insertMany(dummyTextQuestions);
  console.log('Text questions created');
  return result.map(entry => entry._id);
};

const createDepartments = async () => {
  const dummyDepartments = [
    { name: 'Department 1', 
      totalDepartmentScore: 3.5, 
      city: 'City 1', 
      evaluationsCount: 1, 
      demographics: {
        gender: { "Γυναίκα": 0, "Άντρας": 1 },
        ageGroup: { "18-25": 1 },
        educationLevel: { "Φοιτητής": 1 },
        contact:{"Διαδίκτυο":1}
      },
      averageScores: [{ question: 'ερώτηση 1', score: 4 },{ question: 'ερώτηση 2', score: 3 }] },
    
    { name: 'Department 2', 
    totalDepartmentScore: 4, 
    city: 'City 1', 
    evaluationsCount: 1, 
    demographics: {
      gender: { "Γυναίκα": 1, "Άντρας": 0 },
      ageGroup: { "35-45": 1 },
      educationLevel: { "Υπάλληλος": 1 },
      contact:{"Διαδίκτυο":1}
    },
    averageScores: [{question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 5 }] },
    
    { name: 'Department 3', 
      totalDepartmentScore: 3.5, 
      city: 'City 1', 
      evaluationsCount: 1, 
      demographics: {
        gender: { "Γυναίκα": 0, "Άντρας": 1 },
        ageGroup: { "18-25": 1 },
        educationLevel: { "Φοιτητής": 1 },
        contact:{"Διαδίκτυο":1}
      },
      averageScores: [{ question: 'ερώτηση 1', score: 4 },{ question: 'ερώτηση 2', score: 3 }] },
    
    { name: 'Department 1', 
    totalDepartmentScore: 3, 
    city: 'City 2', 
    evaluationsCount: 1, 
    demographics: {
      gender: { "Γυναίκα": 0, "Άντρας": 1 },
      ageGroup: { "25-35": 1 },
      educationLevel: { "Άνεργος": 1 },
      contact:{"Διαδίκτυο":1}
    },
    averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 3 }]},
    
    { name: 'Department 2', 
    totalDepartmentScore: 2.5,
    city: 'City 2', 
    evaluationsCount: 1, 
    demographics: {
      gender: { "Γυναίκα": 1, "Άντρας": 0 },
      ageGroup: { "18-25": 1 },
      educationLevel: { "Φοιτητής": 1 },
      contact:{"Διαδίκτυο":1}
    },
    averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 2 } ]},
  ];

  const result = await Department.insertMany(dummyDepartments);
  console.log('Departments created');
  return result.map(entry => entry._id);
};

const createCities = async (departmentIds) => {
  const dummyCities = [
    {
      name: 'City 1',
      departments: [
        { name: 'Department 1', 
        totalDepartmentScore: 3.5, 
        city: 'City 1', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 4 },{ question: 'ερώτηση 2', score: 3 }]},
        
        { name: 'Department 2', 
        totalDepartmentScore: 4, 
        city: 'City 1', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 1, "Άντρας": 0 },
          ageGroup: { "35-45": 1 },
          educationLevel: { "Υπάλληλος": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 5 }]  }
      ],
      cityScore: 3.75, 
      evaluationsCount: 2,
      demographics: {
        gender: { "Γυναίκα": 1, "Άντρας": 1 },
        ageGroup: { "18-25": 1 , "35-45":1},
        educationLevel: { "Φοιτητής": 1, "Υπάλληλος": 1},
        contact:{"Διαδίκτυο":2}
      },
    },
    {
      name: 'City 2',
      departments: [
        { name: 'Department 1', 
        totalDepartmentScore: 3, 
        city: 'City 2', 
        evaluationsCount: 1,        
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "25-35": 1 },
          educationLevel: { "Άνεργος": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 3 }] },
        
        { name: 'Department 2', 
        totalDepartmentScore: 2.5, 
        city: 'City 2', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 1, "Άντρας": 0 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 2 } ]},
      ],
      cityScore: 2.75, 
      evaluationsCount: 2,
      demographics: {
        gender: { "Γυναίκα": 1, "Άντρας": 1 },
        ageGroup: { "18-25": 1 , "25-35":1 },
        educationLevel: { "Φοιτητής": 1, "Άνεργος": 1},
        contact:{"Διαδίκτυο":2}
      },
    },
  ];

  await City.insertMany(dummyCities);
  console.log('Cities created');
};


const createEvaluations = async (scoringQuestionIds, textQuestionIds, departmentIds) => {
  const dummyEvaluations = [
    {
      scoringQuestions: [
        { question: 'ερώτηση 1', score: 4 },
        { question: 'ερώτηση 2', score: 3 },
      ],
      textQuestions: [
        { question: 'Text Question 1', answer: 'Answer 1' },
        { question: 'Text Question 2', answer: 'Answer 2' },
      ],
      department: { 
        name: 'Department 1', 
        totalDepartmentScore: 3.5, 
        city: 'City 1', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 4 },{ question: 'ερώτηση 2', score: 3 }] 
      },
    },

    {
      scoringQuestions: [
        { question: 'ερώτηση 1', score: 3 },
        { question: 'ερώτηση 2', score: 5 },
      ],
      textQuestions: [
        { question: 'Text Question 1', answer: 'Answer 1' },
        { question: 'Text Question 2', answer: 'Answer 2' },
      ],
      department: { 
        name: 'Department 2', 
        totalDepartmentScore: 4, 
        city: 'City 1', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 1, "Άντρας": 0 },
          ageGroup: { "35-45": 1 },
          educationLevel: { "Υπάλληλος": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 5 }] 
      },
    },

    {
      scoringQuestions: [
        { question: 'ερώτηση 1', score: 3 },
        { question: 'ερώτηση 2', score: 3 },
      ],
      textQuestions: [
        { question: 'Text Question 1', answer: 'Answer 1' },
        { question: 'Text Question 2', answer: 'Answer 2' },
      ],
      department: {
        name: 'Department 1', 
        totalDepartmentScore: 3, 
        city: 'City 2', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "25-35": 1 },
          educationLevel: { "Άνεργος": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 3 }]
      },
    },

    {
      scoringQuestions: [
        { question: 'ερώτηση 1', score: 3 },
        { question: 'ερώτηση 2', score: 2 },
      ],
      textQuestions: [
        { question: 'Text Question 1', answer: 'Answer 1' },
        { question: 'Text Question 2', answer: 'Answer 2' },
      ],
      department: {
        name: 'Department 2', 
        totalDepartmentScore: 2.5, 
        city: 'City 2', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 1, "Άντρας": 0 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{ question: 'ερώτηση 1', score: 3},  {question: 'ερώτηση 2', score: 2 } ]
      },          
    },
  ];

  await Evaluation.insertMany(dummyEvaluations);
  console.log('Evaluations created');
};


module.exports = { connectToMongoDB };

