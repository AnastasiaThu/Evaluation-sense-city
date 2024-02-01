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
      //const scoringQuestionIds = await createScoringQuestions();
      //const textQuestionIds = await createTextQuestions();
      const departmentIds = await createDepartments();
      const citiesIds = await createCities();
      const evaluationsIds = await createEvaluations();
    }

  } catch (error) {
    console.error(error);
  }
}

const checkEmpty = async () => {
    //const scoringQEmpty = await ScoringQuestion.countDocuments() === 0;
    //const textQEmpty = await TextQuestion.countDocuments() === 0;
    const questionsEmpty = await Question.countDocuments() === 0;
    const departmentsEmpty = await Department.countDocuments() === 0;
    const citiesEmpty = await City.countDocuments() === 0;
    const evaluationsEmpty = await Evaluation.countDocuments() === 0;
    
  
    // return scoringQEmpty && textQEmpty && departmentsEmpty && citiesEmpty && evaluationsEmpty&& questionsEmpty;
    return questionsEmpty && departmentsEmpty && citiesEmpty && evaluationsEmpty;
  }

const createQuestions = async () => {
  const dummyQuestions = [
    {
      description: 'Πόσο ικανοποιημένοι είστε από την εξυπηρέτηση του τμήματος;', 
      label: 'Εξυπηρέτηση', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 1,
    },
    { 
      description: 'Πόσο ευχαριστημένοι είστε από τον χρόνο αποκατάστασης;',
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
      label: '??', 
      type: 'text',
      options: ['Διαδίκτυο', 'Γνωστός', 'Έντυπο', 'Δημόσια Υπηρεσία', 'Άλλο'],
      required: true,	
      order: 4,
    },
    {
      description: 'Επιλέξτε το φύλο σας',	
      label: 'Φύλο', 
      type: 'text',
      options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
      required: false,	
      order: 5,
    },
    {
      description: 'Δώστε το έτος γέννησής σας',	
      label: 'Ηλικία', 
      type: 'date',
      required: false,	
      order: 6,
    },
    {
      description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',	
      label: 'Εκπαιδευτικό Επίπεδο', 
      type: 'text',
      options: ["Α' βάθμια (Δημοτικό)", "Β' βάθμια (Γυμνάσιο/Λύκειο)", "Γ' βάθμια (ΑΕΙ/ΤΕΙ)", "Μεταπτυχιακές Σπουδές"],
      required: false,	
      order: 7,
    },
    // {
    //   description: 'Επιλέξτε την επαγγελματική σας απασχόληση',	
    //   label: 'Εκπαιδευτικό Επίπεδο', 
    //   type: 'text',
    //   options: ["Φοιτητής", "Δημόσιος Υπάλληλος", "Ιδιωτικός Υπάλληλος", "Ελεύθερος Επαγγελματίας", "Οικιακά", "Συνταξιούχος", "Άνεργος"],
    //   required: false,	
    //   order: 7,
    // },
    
  ]
  const result = await Question.insertMany(dummyQuestions);
  console.log('Questions created');
  return result.map(entry => entry._id);
};


const createDepartments = async () => {
    const dummyDepartments = [
      { name: 'Department 1', 
        totalDepartmentScore: 3.5, 
        city: 'patratest', 
        evaluationsCount: 3, 
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
  
        },
      
      { name: 'Department 2', 
      totalDepartmentScore: 4, 
      city: 'patratest', 
      evaluationsCount: 1, 
      demographics: {
        gender: { "Γυναίκα": 1, "Άντρας": 0 },
        ageGroup: { "35-45": 1 },
        educationLevel: { "Υπάλληλος": 1 },
        contact:{"Διαδίκτυο":1}
      },
      averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
  
    },
      
      { name: 'Department 3', 
        totalDepartmentScore: 3.5, 
        city: 'patratest', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 0, "Άντρας": 1 },
          ageGroup: { "18-25": 1 },
          educationLevel: { "Φοιτητής": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
  
         },      

    ];
  
    const result = await Department.insertMany(dummyDepartments);
    console.log('Departments created');
    return result.map(entry => entry._id);
  };


  const createCities = async () => {
    const dummyCities = [
      {
        name: 'patratest',
        departments: [
          { name: 'Department 1', 
          totalDepartmentScore: 3.5, 
          city: 'patratest', 
          evaluationsCount: 3, 
          demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
          },
          averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
    
          },
        
        { name: 'Department 2', 
        totalDepartmentScore: 4, 
        city: 'patratest', 
        evaluationsCount: 1, 
        demographics: {
          gender: { "Γυναίκα": 1, "Άντρας": 0 },
          ageGroup: { "35-45": 1 },
          educationLevel: { "Υπάλληλος": 1 },
          contact:{"Διαδίκτυο":1}
        },
        averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
    
      },
        
        { name: 'Department 3', 
          totalDepartmentScore: 3.5, 
          city: 'patratest', 
          evaluationsCount: 1, 
          demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
          },
          averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
    
           },
        ],
        cityScore: 3.5, 
        evaluationsCount: 5,
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
  
  
  const createEvaluations = async () => {
    const dummyEvaluations = [
      {
        scoringQuestions: [
            {
                question: {
                  description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος?',
                  label: 'Εξυπηρέτηση',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 1,
                },
                score: 3,
              },
              {
                question: {
                  description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
                  label: 'Χρόνος αποκατάστασης',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 2,
                },
                score: 4,
              },
              {
                question: {
                  description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
                  label: 'Επικοινωνία',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 3,
                },
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: {
                  description: 'Πώς μάθατε για την υπηρεσία;',
                  type: 'text',
                  options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
                  scoreOptions: [],
                  required: true,
                  order: 4,
                },
                answer: 'Γνωστός',
              },
              {
                question: {
                  description: 'Επιλέξτε το φύλο σας',
                  type: 'text',
                  options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
                  scoreOptions: [],
                  required: false,
                  order: 5,
                },
                answer: 'Άντρας',
              },
              {
                question: {
                  description: 'Δώστε το έτος γέννησής σας',
                  type: 'date',
                  options: [],
                  scoreOptions: [],
                  required: false,
                  order: 6,
                },
                answer: '1990', 
              },
              {
                question: {
                  description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
                  type: 'text',
                  options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
                  scoreOptions: [],
                  required: false,
                  order: 7,
                },
                answer: 'Υπάλληλος',
              },
        ],
        department: { 
          name: 'Department 1', 
          totalDepartmentScore: 3.5, 
            city: 'patratest', 
            evaluationsCount: 3, 
            demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
            },
            averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
        },
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
            {
                question: {
                  description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος?',
                  label: 'Εξυπηρέτηση',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 1,
                },
                score: 3,
              },
              {
                question: {
                  description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
                  label: 'Χρόνος αποκατάστασης',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 2,
                },
                score: 4,
              },
              {
                question: {
                  description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
                  label: 'Επικοινωνία',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 3,
                },
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: {
                  description: 'Πώς μάθατε για την υπηρεσία;',
                  type: 'text',
                  options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
                  scoreOptions: [],
                  required: true,
                  order: 4,
                },
                answer: 'Γνωστός',
              },
              {
                question: {
                  description: 'Επιλέξτε το φύλο σας',
                  type: 'text',
                  options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
                  scoreOptions: [],
                  required: false,
                  order: 5,
                },
                answer: 'Άντρας',
              },
              {
                question: {
                  description: 'Δώστε το έτος γέννησής σας',
                  type: 'date',
                  options: [],
                  scoreOptions: [],
                  required: false,
                  order: 6,
                },
                answer: '1990', 
              },
              {
                question: {
                  description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
                  type: 'text',
                  options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
                  scoreOptions: [],
                  required: false,
                  order: 7,
                },
                answer: 'Υπάλληλος',
              },
        ],
        department: { 
          name: 'Department 1', 
          totalDepartmentScore: 3.5, 
            city: 'patratest', 
            evaluationsCount: 3, 
            demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
            },
            averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
        },
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
            {
                question: {
                  description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος?',
                  label: 'Εξυπηρέτηση',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 1,
                },
                score: 3,
              },
              {
                question: {
                  description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
                  label: 'Χρόνος αποκατάστασης',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 2,
                },
                score: 4,
              },
              {
                question: {
                  description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
                  label: 'Επικοινωνία',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 3,
                },
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: {
                  description: 'Πώς μάθατε για την υπηρεσία;',
                  type: 'text',
                  options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
                  scoreOptions: [],
                  required: true,
                  order: 4,
                },
                answer: 'Γνωστός',
              },
              {
                question: {
                  description: 'Επιλέξτε το φύλο σας',
                  type: 'text',
                  options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
                  scoreOptions: [],
                  required: false,
                  order: 5,
                },
                answer: 'Άντρας',
              },
              {
                question: {
                  description: 'Δώστε το έτος γέννησής σας',
                  type: 'date',
                  options: [],
                  scoreOptions: [],
                  required: false,
                  order: 6,
                },
                answer: '1990', 
              },
              {
                question: {
                  description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
                  type: 'text',
                  options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
                  scoreOptions: [],
                  required: false,
                  order: 7,
                },
                answer: 'Υπάλληλος',
              },
        ],
        department: { 
          name: 'Department 3', 
          totalDepartmentScore: 3.5, 
            city: 'patratest', 
            evaluationsCount: 1, 
            demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
            },
            averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
        },
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
            {
                question: {
                  description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος?',
                  label: 'Εξυπηρέτηση',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 1,
                },
                score: 3,
              },
              {
                question: {
                  description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
                  label: 'Χρόνος αποκατάστασης',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 2,
                },
                score: 4,
              },
              {
                question: {
                  description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
                  label: 'Επικοινωνία',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 3,
                },
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: {
                  description: 'Πώς μάθατε για την υπηρεσία;',
                  type: 'text',
                  options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
                  scoreOptions: [],
                  required: true,
                  order: 4,
                },
                answer: 'Γνωστός',
              },
              {
                question: {
                  description: 'Επιλέξτε το φύλο σας',
                  type: 'text',
                  options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
                  scoreOptions: [],
                  required: false,
                  order: 5,
                },
                answer: 'Άντρας',
              },
              {
                question: {
                  description: 'Δώστε το έτος γέννησής σας',
                  type: 'date',
                  options: [],
                  scoreOptions: [],
                  required: false,
                  order: 6,
                },
                answer: '1990', 
              },
              {
                question: {
                  description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
                  type: 'text',
                  options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
                  scoreOptions: [],
                  required: false,
                  order: 7,
                },
                answer: 'Υπάλληλος',
              },
        ],
        department: { 
          name: 'Department 2', 
          totalDepartmentScore: 3.5, 
            city: 'patratest', 
            evaluationsCount: 1, 
            demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
            },
            averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
        },
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
            {
                question: {
                  description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος?',
                  label: 'Εξυπηρέτηση',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 1,
                },
                score: 3,
              },
              {
                question: {
                  description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
                  label: 'Χρόνος αποκατάστασης',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 2,
                },
                score: 4,
              },
              {
                question: {
                  description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
                  label: 'Επικοινωνία',
                  type: 'scoring',
                  options: [],
                  scoreOptions: [1, 2, 3, 4, 5],
                  required: true,
                  order: 3,
                },
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: {
                  description: 'Πώς μάθατε για την υπηρεσία;',
                  type: 'text',
                  options: ['Διαδίκτυο', 'Γνωστός', 'Άλλο'],
                  scoreOptions: [],
                  required: true,
                  order: 4,
                },
                answer: 'Γνωστός',
              },
              {
                question: {
                  description: 'Επιλέξτε το φύλο σας',
                  type: 'text',
                  options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
                  scoreOptions: [],
                  required: false,
                  order: 5,
                },
                answer: 'Άντρας',
              },
              {
                question: {
                  description: 'Δώστε το έτος γέννησής σας',
                  type: 'date',
                  options: [],
                  scoreOptions: [],
                  required: false,
                  order: 6,
                },
                answer: '1990', 
              },
              {
                question: {
                  description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
                  type: 'text',
                  options: ['Φοιτητής', 'Υπάλληλος', 'Άνεργος'],
                  scoreOptions: [],
                  required: false,
                  order: 7,
                },
                answer: 'Υπάλληλος',
              },
        ],
        department: { 
          name: 'Department 3', 
          totalDepartmentScore: 3.5, 
            city: 'patratest', 
            evaluationsCount: 1, 
            demographics: {
            gender: { "Γυναίκα": 0, "Άντρας": 1 },
            ageGroup: { "18-25": 1 },
            educationLevel: { "Φοιτητής": 1 },
            contact:{"Διαδίκτυο":1}
            },
            averageScores: [{question: 'Εξυπηρέτηση', score: 3},  {question: 'Χρόνος αποκατάστασης', score: 5 },{question: 'Επικοινωνία', score: 5 }] 
        },
        status: 'completed',
        requestID: '1234567890',
      },
    ];
  
    await Evaluation.insertMany(dummyEvaluations);
    console.log('Evaluations created');
  };
  
  


module.exports = { connectToMongoDB };

