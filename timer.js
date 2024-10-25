const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

class Timer {
  #duration;
  #rotationDay;
  #rotationTimeInPmOrAm;
  #hoursInMilliseconds = 1000 * 60 * 60 * 24;

  constructor(duration, rotationDay, rotationTimeInPmOrAm) {
    this.#duration = duration;
    this.#rotationDay = rotationDay;
    this.#rotationTimeInPmOrAm = rotationTimeInPmOrAm;
  }

  /**
   * @assignRotationStamp
   * Handle timing setup for cycle working with the input data
   * @returns
   */
  assignRotationStamp() {
    const selectDayIndex = DAYS_OF_WEEK?.findIndex(
      day => day?.toLowerCase() === this.#rotationDay?.toLowerCase()
    );
    const durationByDays = +this.#duration?.replace(/(days|day)/gi, '')?.trim();

    //interpolate to get target day
    const gapBetweenCurrentAndSelectedDay =
      new Date().getDay() - selectDayIndex; //'+' as past and '-' as future
    const targetDayInPastOrFutureOrCurrentDay =
      Date.now() - this.#hoursInMilliseconds * gapBetweenCurrentAndSelectedDay;
    const isInPast = selectDayIndex < gapBetweenCurrentAndSelectedDay;

    // considering future only in 'targetDayInPastOrFutureOrCurrentDay' while predicting the future if isInPast is true
    const targetDay = isInPast
      ? targetDayInPastOrFutureOrCurrentDay +
        this.#hoursInMilliseconds * durationByDays
      : targetDayInPastOrFutureOrCurrentDay;

    //date in format 2024-12-03
    const daysLeftToStartInString = new Date(targetDay)
      .toLocaleDateString('en-GB')
      ?.split('/')
      ?.reverse()
      .join('-');

    //time
    const timeGiven = this.#rotationTimeInPmOrAm?.slice(0, -2)?.trim();
    const time = timeGiven?.length < 4 ? `${timeGiven}:00` : timeGiven; //07:00:00
    const dayTime = this.#rotationTimeInPmOrAm?.slice(-2); //am or pm

    //In full config e.g "2024-12-03 07:00:00 am"
    const formattedDateTime = `${daysLeftToStartInString} ${time} ${dayTime}`;
    return new Date(formattedDateTime).getTime();
  }

  /**
   * @resetByDurationIfExpired
   * Handle update recycle time
   * @param {*} param0
   * @returns
   */
  resetByDurationIfExpired({ last_assigned_question, expiration_stamp }) {
    const currentStamp = Date.now();
    const durationByDays = +this.#duration?.replace(/(days|day)/gi, '')?.trim();
    const resetStartDateTimeInMilliseconds =
    Date.now() + durationByDays * this.#hoursInMilliseconds;
    
    // expiration_stamp = Date.now() - 1000 * 60 * 60 * 24 * 2;//assumed expired test value
    if (currentStamp > expiration_stamp) {
      return {
        is_expired: true,
        timeInMilliseconds: resetStartDateTimeInMilliseconds,
        assigned_question: last_assigned_question + 1
      };
    }
    return {
      is_expired: false,
      timeInMilliseconds: expiration_stamp,
      assigned_question: last_assigned_question
    };
  }
}

module.exports = Timer;
