const express = require('express');
const router = express.Router();
const { Evaluation } = require('../model/evaluation.js');
const { ScoringQuestion } = require('../model/scoringQuestion.js');
const { TextQuestion } = require('../model/textQuestion.js')
const { City } = require('../model/city.js');
const { Department } = require('../model/department.js');
const {Question} = require('../model/question.js');
const {ReOpenIssue} = require('../model/reopenedIssue.js');

// (B) Send email after a request is completed & update request // https://apitest.sense.city/api/1.0/ admin/bugs/update 

// when submit is selected a post request is done sending the reqID /reqObj and the date of submission
// the endpoint finds the request using the reqID and updates its status to "completed" 
// then it sends an email to the user with the requestID / the requestObj and the date of submission & city, department
//`Αγαπητέ/ή ${req.body.name}, σας ενημερώνουμε ότι η αίτησή σας με αριθμό ${req.body.requestID} έχει ολοκληρωθεί.`

// const nodemailer = require('nodemailer');
// const transporter = nodemailer.createTransport({
//   service: 'gmail',  
//   auth: {
//     user: process.env.EMAIL,
//     pass: process.env.PASSWORD
//   }
// });
  
//router.post('/send-email', async (req, res) => {
//   try {
//     // const requestID = req.params.id
//     const requestID = req.body.requestID
//     const reqStatus = req.body.status
//     const resolution = req.body.resolution  //or from the reqObj
//     // const userEmail = req.body.email

//     if(reqStatus==="RESOLVED" && resolution==="FIXED" && res9[0].user.email){

//       //update request status 
//       const transporter = nodemailer.createTransport({
//           service: 'gmail',  
//           auth: {
//             user: process.env.EMAIL,
//             pass: process.env.PASSWORD
//           }
//         });

//         //send also submission date
//         const mailOptions = {
//             from: '"Sense.City " <info@sense.city>',
//             to: res9[0].user.email,
//             subject: ' Αξιολογίστε την πορεία του αιτήματος σας "'+req.body.ids[0]+'" SenseCity Info ', // Subject line
//             text: ' Για να αξιολογίσετε το αίτημα σας παρακαλώ ακολουθήστε τον σύνδεσμος <a href="http://localhost:4200/reviews/'+body.bugs[0].alias[0]+'"> Αξιολόγιση </a>', // plaintext body
//             html: 'Για να αξιολογίσετε το αίτημα σας παρακαλώ ακολουθήστε τον σύνδεσμος <a href="http://localhost:4200/reviews/'+body.bugs[0].alias[0]+'"> Αξιολόγιση </a> '
//         };

//           await transporter.sendMail(mailOptions);
//           res.status(200).json({ message: 'Email sent successfully' });

//     }else{

//     }
//     //const submisionDate = Date.now()
//     //give Date.now() and convert it to remove time then use test value for now

//     //Get the data related to the request using requestID (city,department) to send them to email
//     //or get the data when opening the email link sine requestID will be known there too

//     //Update request status to "completed"
  
//     // send email
//     // const mailOptions = {
//     //   from: process.env.EMAIL,
//     //   to: req.body.email,
//     //   subject: 'Αξιολόγηση Υπηρεσίας',
//     //   text: 'Σας ευχαριστούμε για την αξιολόγηση της υπηρεσίας μας!'
//     // };
//     // await transporter.sendMail(mailOptions);
//     // res.status(200).json({ message: 'Email sent successfully' });
//   } catch (error) {
//     console.error(error);
//     res.status(400).json({ error: 'Failed to send email' });
//   }
// });



// (B) Check if the evaluation can still be submitted  // https://apitest.sense.city/api/1.0 /issue/details/:id

//after openning the link the endpoint sends to the frontend an obj {reqId, dateOfSubmis, municipality, department}
//also status?? of req??
// router.get('/check-expiration ', async (req, res) => {
//   try {
//     // const reqID = req.body.requestID
//     const submisionDate = req.body.submisionDate 
    
//     if(submisionDate - Date.now() > 14){
//       //gets printed in the browser's console
//       //or sends a code ex 0 = expired, 1 = still active
//       res.status(200).json({ expired: true });
//     }
//     else{
//       res.status(200).json({ expired: false });
//     }
//   }catch (error) {
//     console.error(error);
//     res.status(400).json({ error: 'Failed to send email' });
//   }
// });
  

//Check if exists evaluation connected to the requestID
router.get('/check-evaluation-status/:requestID', async (req, res) => {
  try {
    const requestID = req.params.requestID;
    // const departmentName = req.query.departmentName;
    // const cityName = req.query.cityName;
    const departmentName = 'Department 1';
    const cityName = 'patratest';
    console.log("check-evaluation-status has data: ", requestID, departmentName, cityName);

    // res.status(200).json({ message: "done"});
    // update evaluation model

    const evaluation = await Evaluation.findOne({ requestID: requestID });  
    if(evaluation){
      console.log("evaluation found: ", evaluation)

      if(evaluation.status === "completed"){
        console.log("in completed")
        res.status(200).json({ statusCode: 0 , message:"Evaluation for this request already done"});  //already evaluated
      }
      else if(evaluation.status === "draft"){
        console.log("in draft")
        res.status(200).json({ statusCode: 1 , evaluation: evaluation});  //opened but not finished
      }
      
    }
    else{
      
      //find department using department name and city name passed at the request
      const department = await Department.findOne({ name: departmentName, city: cityName });
      console.log("check-eval-status - department: ", department)
      const evaluation =  new Evaluation ({
        department: department._id,
        //department: department,
        requestID: requestID,
        status: "draft"
      })
      await evaluation.save() 
      res.status(200).json({ statusCode: 2 , evaluation: evaluation});  //frst time openning evaluation
      // res.status(200).json({ statusCode: 2 , department: department}); 
    }
  } catch (error) {
    console.error("at /check-evaluation-status: ", error);
    res.status(400).json(error);
  }

});

// (B) Request-not-completed - Re-open request   https://apitest.sense.city/api  /1.0/review/reopen/issue/:id

router.post('/open-request/:id', async (req, res) => {  
  try{
    const _id= req.params.id;
    const comment = req.body.comment;
    console.log("open-request OK: ", _id, comment)

    res.status(200).json({ comment: comment, id: _id});
  }catch (error) {
    console.error("at /check-evaluation-status: ", error);
    res.status(400).json(error);
  }
  
});


//Send questions for evaluation form
router.get('/evaluation-form', async (req, res) => {
  try {
     const questions = await Question.find().sort({ required: -1, order: 1 });
    //const questions = await Question.find()
    console.log("questions: ", questions)

    res.status(200).json({ questions:questions });
  } catch (error) {
    console.error('Error in MongoDB query:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

//Store data from evaluation form
router.post("/submit-evaluation", async (req, res) => {
  try {
    console.log("req.body: ", req.body)
    const scoreQuestionData = req.body.scores
    const textQuestionData = req.body.texts
    const requestID = req.body.requestID
    const evaluationID = req.body.evaluationID
    //test data
    
    // const requestID = "65a43ccf5713b16acc72db73"
    // const scoreQuestionData =  [
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be8d',
    //       description: 'Πόσο ικανοποιημένος είσαι από την εξυπηρέτηση του τμήματος;',
    //       label: 'Εξυπηρέτηση',
    //       type: 'scoring',
    //       options: [],
    //       scoreOptions: [Array],
    //       required: true,
    //       order: 1,
    //       __v: 0
    //     },
    //     score: 3
    //   },
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be8e',
    //       description: 'Πόσο ευχαριστημένος είστε από τον χρόνο αποκατάστασης;',
    //       label: 'Χρόνος αποκατάστασης',
    //       type: 'scoring',
    //       options: [],
    //       scoreOptions: [Array],
    //       required: true,
    //       order: 2,
    //       __v: 0
    //     },
    //     score: 4
    //   },
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be8f',
    //       description: 'Πόσο εύκολο ήταν να επικοινωνήσετε με τον Δήμο;',
    //       label: 'Επικοινωνία',
    //       type: 'scoring',
    //       options: [],
    //       scoreOptions: [Array],
    //       required: true,
    //       order: 3,
    //       __v: 0
    //     },
    //     score: 4
    //   }
    // ]
    // const textQuestionData=  [
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be90',
    //       description: 'Πώς μάθατε για την υπηρεσία;',
    //       type: 'text',
    //       options: [Array],
    //       scoreOptions: [],
    //       required: true,
    //       order: 4,
    //       __v: 0
    //     },
    //     answer: 'Γνωστός'
    //   },
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be91',
    //       description: 'Επιλέξτε το φύλο σας',
    //       type: 'text',
    //       options: [Array],
    //       scoreOptions: [],
    //       required: false,
    //       order: 5,
    //       __v: 0
    //     },
    //     answer: 'Άντρας'
    //   },
    //   {
    //     question: {
    //       _id: '65a4ee63eb6f6f1ff959be93',
    //       description: 'Επιλέξτε το εκπαιδευτικό σας επίπεδο',
    //       type: 'text',
    //       options: [Array],
    //       scoreOptions: [],
    //       required: false,
    //       order: 7,
    //       __v: 0
    //     },
    //     answer: 'Υπάλληλος'
    //   }
    // ]
    // const tempCity = 'City 1'  

    const tempDepartment = 'Department 1'
    const tempCity = 'patratest'  

    console.log("Inside /submit-evaluation")
    console.log("requestID, evaluationID: ", requestID, evaluationID)
    console.log("scoreQuestionData: ", scoreQuestionData)
    console.log("textQuestionData: ", textQuestionData)
    //find dep using reviewID populate dep na epistrefei olo to dep

    //find the department that corresponds to the evaluation
    // const selectedDepartment = await Department.findOne({ name: tempDepartment, city: tempCity });
    // console.log("department to update: ", selectedDepartment)
    const evaluation = await Evaluation.findById(evaluationID).populate('department');
    console.log("submit-eval - evaluation: ", evaluation  )
    if (!evaluation) {
      return res.status(404).json({ error: 'Evaluation not found' });
    }
    const selectedDepartment = evaluation.department;
    console.log("department to update: ", selectedDepartment);
    
    if (selectedDepartment) {
      const {updatedDepartment, demographicsChanged} = await updateDepartmentData(selectedDepartment, scoreQuestionData,textQuestionData);
      
      
      console.log("updated Department: ", updatedDepartment)
      // console.log("demographicsChanged: ", demographicsChanged)

      const selectedCity = await City.findOne({ name: tempCity });
      console.log("city to update: ", selectedCity)
      updateCityScore(selectedCity, updatedDepartment, demographicsChanged)      
 
      
    //   const newEvaluation = await Evaluation.findOneAndUpdate(
    //     { _id: evaluationID },
    //     {
    //         $set: {
    //           scoringQuestions: scoreQuestionData,
    //           textQuestions: textQuestionData,
    //           department: updatedDepartment,
    //           status: "completed",
    //         }
    //     },
    //     { new: true } // Return the updated document
    // );
    // console.log("newEvaluation: ", newEvaluation)

      console.log("done");

    } else {
      console.log('Department not found');
    }
    
    //console.log("done");
    
    //gets printed in the browser's console
    res.status(200).json({ message: 'Evaluation updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Evaluation failed to update' });
  }
});

// Send data for city page
router.get("/city-page", async (req, res) => {

  console.log("inside GET")
  // const tempCity = 'City 1'
  const tempCity = 'patratest'
  const selectedCity = await City.find({ name: tempCity });
  // const cityScore = selectedCity[0].cityScore
  // console.log("City score: ", cityScore)
  console.log("City score: ", selectedCity[0])
  
  //gets printed in the browser's console
  res.status(200).json({ city: selectedCity[0] });
});

// Send data for department page
router.get('/department/:city/:name', async (req, res) => {
  const cityName = req.params.city;
  const departmentName = req.params.name;
  console.log("City-Dep: ", cityName, departmentName)
  const department = await Department.find({ name: departmentName, city: cityName });
  console.log("get department: ", department[0])

  if (department) {
    //gets printed in the browser's console
    res.status(200).json(department[0]);
  } else {
    res.status(404).json({ message: 'Department not found' });
  }
});

//Send department data for specific dates
router.get("/filter-data-date", async (req, res) => {
  console.log("req.query: ", req.query);
  
  // Check if the required parameters are present in the query
  if (req.query.cityName && req.query.departmentName && req.query.startDate && req.query.endDate) {

    //find department using departmentName and cityName
    //get evaluations of department between startDate and endDate
    //calculate average scores of department for those dates      
    //calculate demographics of department for those dates

    const cityName = req.query.cityName;
    const departmentName = req.query.departmentName;
    // const startDate = req.query.startDate; 
    // const endDate = req.query.endDate;


    // //find all evaluations of department with createdAt between startDate and endDate
    // filteredEvaluations = await Evaluation.find(
    //                     { "department.name": departmentName, "department.city": cityName, date: { $gte: startDate, $lte: endDate } });

    // //other route for cityPage
    // //calculate average scores of city for those dates ??
    // //calculate demographics of city for those dates ??
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    console.log("endpoint startDate: ", startDate)
    console.log("endpoint endDate: ", endDate)

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    console.log("endpoint startDate (UTC): ", startDate.toISOString());
    console.log("endpoint endDate (UTC): ", endDate.toISOString());

    try {
      // Find all evaluations of the department with createdAt between startDate and endDate
      const filteredEvaluations = await Evaluation.find({
        "department.name": departmentName,
        "department.city": cityName,
        createdAt: { $gte: startDate, $lte: endDate }
      }).sort({ createdAt: -1 }).limit(1); //keep only the last evaluation

      //last eval department has all the info
      //even id there has been a new question added in the db the questionsArray of the last dep should have it
  
      //---------add new quetsion scenario---------
      //add question to the db
      //update the evaluation form
      //new evaluation entry with the question
      //when passing its data to the db the questionsArray of the evaluations will also have it
      //dep should also have it when updating the dep data
      //when updating the dep if there's a question in the questionArray from the frontend that the 
      //dep doesn't have it should be added to the dep with its data (the question will have been added to the db before)

      if (filteredEvaluations.length > 0) {
        // Extract the department information from the last evaluation
        const lastDepartment = filteredEvaluations[0].department;
        console.log("lastDepartment: ", lastDepartment)


        // Respond with the extracted department information
        res.status(200).json({ filteredData: lastDepartment });
      } else {
        res.status(404).json({ message: 'No evaluations found for the specified criteria' });
      }
      // // gets printed in the browser's console
    // res.status(200).json({ params: req.query });
    } catch (error) {
      console.error('Error in MongoDB query:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }      
  } else {
    res.status(400).json({ message: 'Bad Request - Missing parameters' });
  }
});


//functions
const updateDepartmentData = async (selectedDepartment, scoreQuestionData, textQuestionData) => {
  try {
    const prevTotalScore = selectedDepartment.totalDepartmentScore
    const evaluationsCount = selectedDepartment.evaluationsCount
    const prevAverageScores = selectedDepartment.averageScores
    const prevDemographics = selectedDepartment.demographics;   

    console.log("scoreQuestionData: ", scoreQuestionData)  
    console.log("prevTotalScore: ", prevTotalScore)
    console.log("prevAverageScores: ", prevAverageScores)
    console.log("prevDemographics: ", prevDemographics)

    //Get new totalScore, averageScores values and updatedDemographics
    const newAverageScores = updateAverageScores(prevAverageScores,scoreQuestionData,evaluationsCount);
    // console.log("newAv before: ", newAverageScores)
    const totalScore = updateTotalScore(newAverageScores,prevTotalScore,evaluationsCount);
    const {updatedDemographics, demographicsChanged} = updateDemographics(prevDemographics, textQuestionData);
    // const updatedDemographics = prevDemographics
    // console.log('HERE updatedDemographics:', updatedDemographics);
    
      
    // Save the changes to the database      
    // await Department.updateOne(
    //   { name: selectedDepartment.name, city: selectedDepartment.city },
    //   {$set: {
    //       totalDepartmentScore: totalScore,
    //       averageScores: newAverageScores,
    //       demographics: updatedDemographics,
    //     }
    //   }
    // );

    // console.log("after update: ", selectedDepartment)
    
    // return selectedDepartment;

    //update department
    const updatedDepartment = await Department.findOneAndUpdate(
        { _id: selectedDepartment._id },
        {
            $set: {
                totalDepartmentScore: totalScore,
                evaluationsCount: evaluationsCount +1,
                averageScores: newAverageScores,
                demographics: updatedDemographics,
            }
        },
        { new: true } // Return the updated document
    );

  // console.log("after update: ", updatedDepartment);

  return {updatedDepartment, demographicsChanged};
  } catch (error) {
    console.error('Error updating department:', error);
    throw error; 
  }
};
  
function updateAverageScores(avScores, newScoreData, evaluationsCount){
  let newAverageScores = []

  console.log("avScores: ", avScores)
  console.log("newScoreData: ", newScoreData)
  for (let oldData of avScores) {
    question = oldData.question
    prevScore = oldData.score
    console.log("OLD question: ", question, "prevScore: ", prevScore)
    for (let newData of newScoreData) {
      console.log("newData: ", newData)
      if (question === newData.question.label) {   
        console.log("question: ", question) 
           
        let newScore = ((prevScore * evaluationsCount) + newData.score) / (evaluationsCount + 1);
        newAverageScores.push({ question: question, score: newScore });
      }
    }
  }
  //console.log("newAverageScores: ", newAverageScores)

  console.log("sending newAverageScores: ", newAverageScores)
  return newAverageScores;
}


function updateTotalScore(newAvScores, prevTotalScore, evaluationsCount){
  console.log("inside TotScore")
  let newSum = 0
  //sunlokies erwthseis sth bash - idios ari8mos? sta8? tote apla bgainei apo length 
  console.group("newAvScores: ", newAvScores)
  const questions = newAvScores.length  //noNeed of evaluationsCount
  console.log("questions: ", questions)
  for (let newData of newAvScores){
    let scoreValue = newData.score
    newSum += scoreValue    
  }
  
  const newTotalSum = newSum/questions
  // console.log("types : ", typeof(newSum), typeof(questions))
  console.log("newTotalSum ", newTotalSum)

  return newTotalSum
}

const updateDemographics = (prevDemographics, textQuestionData) => {
  const { gender, ageGroup, educationLevel, contact } = prevDemographics;

  const updatedDemographics = {
    gender: { ...gender },
    ageGroup: { ...ageGroup },
    educationLevel: { ...educationLevel },
    contact: { ...contact },
  };

  const demographicsChanged = []
  const currentYear = new Date().getFullYear();

  console.log("prevDemographics: ", prevDemographics)
  console.log("demographics: ", textQuestionData)

  textQuestionData.forEach((question) => {
    let answer = "";
  
    // if (question.question === "Ηλικία") {
      //question.question.label = "Ηλικία"
    if (question.question.label === "Ηλικία") {
      const age = currentYear - parseInt(question.answer);
  
      if (18 < age && age < 25) {
        answer = "18-25";
      } else if (25 <= age && age < 35) {
        answer = "25-35";
      } else if (35 <= age && age < 45) {
        answer = "35-45";
      } else if (45 <= age && age < 60) {
        answer = "45-60";
      } else if (age >= 60) {
        answer = ">60";
      }
    } else {
      answer = question.answer;
    }

    // Check if the answer matches properties in demographics and update accordingly
    if (gender.hasOwnProperty(answer)) {
      updatedDemographics.gender[answer] += 1;
      demographicsChanged.push(answer)
    } else if (ageGroup.hasOwnProperty(answer)) {
      updatedDemographics.ageGroup[answer] += 1;
      demographicsChanged.push(answer)
    } else if (educationLevel.hasOwnProperty(answer)) {
      updatedDemographics.educationLevel[answer] += 1;
      demographicsChanged.push(answer)
    } else if (contact.hasOwnProperty(answer)) {
      updatedDemographics.contact[answer] += 1;
      demographicsChanged.push(answer)
    }
  });

  console.log("inside func demographicsChanged: ", demographicsChanged)
  return { updatedDemographics, demographicsChanged };
};


async function updateCityScore(selectedCity, updatedDepartment,demographicsChanged) {
  try {
    const newEvaluationsCount = selectedCity.evaluationsCount + 1

    // Update department in the departments array
    const updatedDepartments = selectedCity.departments.map(department => {
      if(department.name=== updatedDepartment.name && department.city===updatedDepartment.city){
 
          console.log("city - UpdatedDep: ", department.city, department.name )
            return updatedDepartment;
        } else {
            return department;
        }
    });

    
    // const updatedDepartments = selectedCity.departments.map(department => {
    //   if (department.equals(updatedDepartment._id)) {
    //     // The department in the array matches the updated department's ObjectId
    //     console.log("City - UpdatedDep: ", department);
    //     return updatedDepartment._id;  // Update the reference
    //   } else {
    //     return department;
    //   }
    // });
    
    // selectedCity.departments = updatedDepartments;
    // await selectedCity.save();


    
    // New total city score
    const newSum = updatedDepartments.reduce((sum, department) => sum + department.totalDepartmentScore, 0);
    const departmentNum = updatedDepartments.length;
    const newTotalScore = newSum / departmentNum;

    
    const newDemographics = updateCityDemographics(selectedCity.demographics, demographicsChanged)
    console.log("In city updatedDepartments: ",updatedDepartments)
    console.log("In city newTotalScore: ",newTotalScore )
    console.log("In city newDemographics: ", newDemographics )
    // Update demographics
    //const newDemographics = updateCityDemographics(selectedCity.demographics, updatedDepartment.demographics)
    
    // Update city
    await City.findOneAndUpdate(
        { _id: selectedCity._id },
        {
            $set: {
                departments: updatedDepartments,
                cityScore: newTotalScore,
                evaluationsCount: newEvaluationsCount,
                demographics: newDemographics
            }
        }
    );

    const updatedCity = await City.findOne({ _id: selectedCity._id });
    console.log(updatedCity);
    } catch (error) {
      console.error('Error updating city score:', error);
      throw error;
  }
}


function updateCityDemographics(cityDemographics, demographicsChanged) {
  
  const { gender, ageGroup, educationLevel, contact } = cityDemographics ;

  const updatedDemographics = {
    gender: { ...gender },
    ageGroup: { ...ageGroup },
    educationLevel: { ...educationLevel },
    contact: { ...contact },
  };
  // console.log("updatedDemographics: ", updatedDemographics)

  for(let changedData of demographicsChanged){
    console.log("changedData: ",changedData )
    if (gender.hasOwnProperty(changedData)) {
      updatedDemographics.gender[changedData] += 1;
    } else if (ageGroup.hasOwnProperty(changedData)) {
      updatedDemographics.ageGroup[changedData] += 1;
    } else if (educationLevel.hasOwnProperty(changedData)) {
      updatedDemographics.educationLevel[changedData] += 1;
    } else if (contact.hasOwnProperty(changedData)) {
      updatedDemographics.contact[changedData] += 1;
    }

  }
  // console.log("updatedDemographics City: ", updatedDemographics)
 
  return updatedDemographics;
}

module.exports = router;


// function calculateAverageScores(scoreResponses) {
//   const averageScores = {};

//   scoreResponses.forEach((response) => {
//     averageScores[response.question] = response.score;
//   });

  
//   return averageScores;
// }