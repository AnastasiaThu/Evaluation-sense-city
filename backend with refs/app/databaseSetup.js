const mongoose = require('mongoose');
const { ScoringQuestion } = require('./model/scoringQuestion');
const { TextQuestion } = require('./model/textQuestion');
const { City } = require('./model/city');
const { Department } = require('./model/department');
const { Evaluation } = require('./model/evaluation');
const {Question} = require('./model/question');
const {ReOpenIssue} = require('./model/reopenedIssue');

const scoreOptions = [1,2,3,4,5];

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.xjxfjhn.mongodb.net/?retryWrites=true&w=majority`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected");
    
    
    
    if (await checkEmpty()) {

      // Initialize collections - generate dummy data

      const questionsIds = await createQuestions();
      const departmentIds = await createDepartments();
      const citiesIds = await createCities(departmentIds);
      const evaluationsIds = await createEvaluations(questionsIds,departmentIds);
      
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
      description: 'Σε τι βαθμό παρείχε το τμήμα κατανοητές και έγκαιρες πληροφορίες σχετικά με το αίτημά σας;', 
      label: 'Βοήθεια', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 5,
    },
    {
      description: 'Πόσο ικανοποιημένοι είστε από την ενημέρωση της κατάστασης και της προόδου του αιτήματός σας κατά τη διάρκεια της διαδικασίας;', 
      label: 'Ενημέρωση προόδου', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 6,
    },
    {
      description: 'Πώς θα αξιολογούσατε τον επαγγελματισμό και την ευγένεια του προσωπικού του τμήματος κατά τη διάρκεια της αλληλεπίδρασης;', 
      label: 'Επαγγελματισμός Τμήματος', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 7,
    },
    {
      description: 'Πόσο πιθανό είναι να συστήσετε τις υπηρεσίες του τμήματος σε άλλους βασιζόμενοι στην εμπειρία σας;', 
      label: 'Σύσταση Τμήματος', 
      type: 'scoring', 
      scoreOptions: scoreOptions,
      required: true,
      order: 8,
    },
    {
      description: 'Επιλέξτε το φύλο σας',	
      label: 'Φύλο', 
      type: 'text',
      options: ['Γυναίκα', 'Άντρας', 'Άλλο'],
      required: false,	
      order: 8,
    },
    {
      description: 'Δώστε το έτος γέννησής σας',	
      label: 'Ηλικία', 
      type: 'date',
      required: false,	
      order: 9,
    },
    {
      description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',	
      label: 'Εκπαιδευτικό Επίπεδο', 
      type: 'text',
      options: ["Α' βάθμια (Δημοτικό)", "Β' βάθμια (Γυμνάσιο/Λύκειο)", "Γ' βάθμια (ΑΕΙ/ΤΕΙ)", "Μεταπτυχιακές Σπουδές"],
      required: false,	
      order: 10,
    },
    {
      description: 'Επιλέξτε την επαγγελματική σας απασχόληση',	
      label: 'Απασχόληση', 
      type: 'text',
      options: ["Φοιτητής", "Δημόσιος Υπάλληλος", "Ιδιωτικός Υπάλληλος", "Ελεύθερος Επαγγελματίας", "Οικιακά", "Συνταξιούχος", "Άνεργος"],
      required: false,	
      order: 11,
    },
    
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


  const createCities = async (departmentIds) => {
    const dummyCities = [
      {
        name: 'patratest',
        departments: departmentIds,
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
  
    const result = await City.insertMany(dummyCities);
    console.log('Cities created');
    return result.map(entry => entry._id);
  };
  
  
  const createEvaluations = async (questionsIds,departmentIds) => {
    const dummyEvaluations = [
      {
        scoringQuestions: [
            {
                question: questionsIds[0],
                score: 3,
              },
              {
                question: questionsIds[1],
                score: 4,
              },
              {
                question: questionsIds[2],
                score: 3,
              },
        ],
        textQuestions: [
            {
                question: questionsIds[3],
                answer: 'Γνωστός',
              },
              {
                question: questionsIds[4],
                answer: 'Άντρας',
              },
              {
                question: questionsIds[5],
                answer: '1990', 
              },
              {
                question: questionsIds[6],
                answer: 'Υπάλληλος',
              },
        ],
        department: departmentIds[0],
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
          {
              question: questionsIds[0],
              score: 3,
            },
            {
              question: questionsIds[1],
              score: 4,
            },
            {
              question: questionsIds[2],
              score: 3,
            },
      ],
      textQuestions: [
          {
              question: questionsIds[3],
              answer: 'Γνωστός',
            },
            {
              question: questionsIds[4],
              answer: 'Άντρας',
            },
            {
              question: questionsIds[5],
              answer: '1990', 
            },
            {
              question: questionsIds[6],
              answer: 'Υπάλληλος',
            },
      ],
        department: departmentIds[0],
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
          {
              question: questionsIds[0],
              score: 3,
            },
            {
              question: questionsIds[1],
              score: 4,
            },
            {
              question: questionsIds[2],
              score: 3,
            },
      ],
      textQuestions: [
          {
              question: questionsIds[3],
              answer: 'Γνωστός',
            },
            {
              question: questionsIds[4],
              answer: 'Άντρας',
            },
            {
              question: questionsIds[5],
              answer: '1990', 
            },
            {
              question: questionsIds[6],
              answer: 'Υπάλληλος',
            },
      ],
        department: departmentIds[0],
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
          {
              question: questionsIds[0],
              score: 3,
            },
            {
              question: questionsIds[1],
              score: 4,
            },
            {
              question: questionsIds[2],
              score: 3,
            },
      ],
      textQuestions: [
          {
              question: questionsIds[3],
              answer: 'Γνωστός',
            },
            {
              question: questionsIds[4],
              answer: 'Άντρας',
            },
            {
              question: questionsIds[5],
              answer: '1990', 
            },
            {
              question: questionsIds[6],
              answer: 'Υπάλληλος',
            },
      ],
        department: departmentIds[1],
        status: 'completed',
        requestID: '1234567890',
      },
      {
        scoringQuestions: [
          {
              question: questionsIds[0],
              score: 3,
            },
            {
              question: questionsIds[1],
              score: 4,
            },
            {
              question: questionsIds[2],
              score: 3,
            },
      ],
      textQuestions: [
          {
              question: questionsIds[3],
              answer: 'Γνωστός',
            },
            {
              question: questionsIds[4],
              answer: 'Άντρας',
            },
            {
              question: questionsIds[5],
              answer: '1990', 
            },
            {
              question: questionsIds[6],
              answer: 'Υπάλληλος',
            },
      ],
        department: departmentIds[2],
        status: 'completed',
        requestID: '1234567890',
      },
    ];
 
    const result = await Evaluation.insertMany(dummyEvaluations);
    console.log('Evaluations created');
    return result.map(entry => entry._id);
  };
  
  
module.exports = { connectToMongoDB };

