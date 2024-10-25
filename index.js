const STORED_QUESTIONS = require('./stored-questions.json');
const STORED_USERS = require('./users.json');
const Timer = require('./timer');

//initial state
let cycleCacheOnDB = {
  last_assigned_question: 1,
  next_assigned_question: 1
};

class DynamicQuestionAssigner extends Timer {
  #questions;

  constructor({
    durationByDays = '5 days',
    rotationDay = 'monday',
    rotationTimeInPmOrAm = '7pm'
  }) {
    super(durationByDays, rotationDay, rotationTimeInPmOrAm);
    this.#questions = this.#questionByRegions();
  }

  /**
   * Handles grouping of time based on region
   * @returns
   */
  #questionByRegions() {
    const questions = STORED_QUESTIONS?.data;

    return questions?.reduce((acc, question) => {
      if (!acc[question?.region]) {
        acc[question?.region] = [];
      }

      const expiration_stamp = this.assignRotationStamp();
      return {
        ...acc,
        [question?.region]: [
          ...acc[question?.region],
          { ...question, expiration_stamp }
        ]
      };
    }, {});
  }

  /**
   * @cycle
   * Handle assignment of question to users and tracking of questions
   * @returns
   */
  cycle() {
    const expiration_stamp = this.assignRotationStamp();
    const users = STORED_USERS?.data;

    //check cycle span
    const { is_expired, timeInMilliseconds, assigned_question } =
      this.resetByDurationIfExpired({
        ...cycleCacheOnDB,
        expiration_stamp
      });

    const assignList = [];
    users.forEach(({ name, region }) => {
      const regionalQuestion = this.#questions[region]?.find(
        (question, index) => {
          const currentQuestionIndex = index;
          const targetQuestionIndex = assigned_question - 1;
          if (targetQuestionIndex === currentQuestionIndex) {
            return question;
          }
        }
      );

      assignList.push({
        user_assigned: name,
        question: regionalQuestion?.question,
        region,
        assigned_question,
        next_rotation: new Date(timeInMilliseconds)
      });
    });

    //update cycleCache if question expires
    if (is_expired) {
      cycleCacheOnDB = {
        last_assigned_question: cycleCacheOnDB?.next_assigned_question,
        next_assigned_question: assigned_question
      };
    }

    return assignList;
  }
}

// const assigner = new DynamicQuestionAssigner({
//   durationByDays: '7 days',
//   rotationDay: 'Sunday',
//   rotationTimeInPmOrAm: '04:30pm'
// });//customize
const assigner = new DynamicQuestionAssigner({}); //default
console.log(
  'DynamicQuestionAssigner',
  assigner.cycle(),
  '\n cycleCacheOnDB',
  cycleCacheOnDB
);
