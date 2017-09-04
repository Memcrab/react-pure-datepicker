import React from 'react';
import PropTypes from 'prop-types';
import ReactPureModal from 'react-pure-modal';
import instadate from 'instadate';
import { format as pureDateFormat } from 'react-pure-time';

class PureDatepicker extends React.Component {
  static isDateValid(possibleDate) {
    if (Object.prototype.toString.call(possibleDate) === '[object Date]') {
      if (isNaN(possibleDate.getTime())) {
        return false;
      }
      return true;
    }
    return false;
  }

  static getYearsPeriod(currentYear, years) {
    const period = [];
    let fromYear = currentYear + years[0];
    const toYear = currentYear + years[1];

    while (fromYear <= toYear) {
      period.push(fromYear);
      fromYear += 1;
    }
    return period;
  }

  static normalizeDate(date, accuracy = '', direction = '') {
    switch (`${accuracy}-${direction}`) {
      case 'month-up':
        return instadate.lastDateInMonth(date);
      case 'month-down':
        return instadate.firstDateInMonth(date);
      case 'year-up':
        return new Date(date.getFullYear, 11, 31);
      case 'year-down':
        return new Date(date.getFullYear, 0, 1);
      default:
        return date;
    }
  }

  static toDate(dateString) {
    return instadate.parseISOString(dateString);
  }

  constructor(props) {
    super(props);
    this.getDateClasses = this.getDateClasses.bind(this);
    this.getMonthClasses = this.getMonthClasses.bind(this);
    this.getYearClasses = this.getYearClasses.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.openDatepickerModal = this.openDatepickerModal.bind(this);
    this.clear = this.clear.bind(this);
    this.state = {
      value: this.constructor.toDate(props.value),
      min: this.constructor.toDate(props.min),
      max: this.constructor.toDate(props.max),
      today: this.constructor.toDate(props.today),
    };
  }

  componentWillReceiveProps(nextProps) {
    const stateUpdate = {};
    if (this.props.value !== nextProps.value) {
      stateUpdate.value = this.constructor.toDate(nextProps.value);
    }
    if (this.props.min !== nextProps.min) {
      stateUpdate.min = this.constructor.toDate(nextProps.min);
    }
    if (this.props.max !== nextProps.max) {
      stateUpdate.max = this.constructor.toDate(nextProps.max);
    }
    if (this.props.today !== nextProps.today) {
      stateUpdate.today = this.constructor.toDate(nextProps.today);
    }
    if (Object.keys(stateUpdate).length > 0) {
      this.setState(stateUpdate);
    }
  }

  getDateClasses(date, value, renderedDate, min, max) {
    const classes = ['date-cell'];
    if (instadate.isWeekendDate(date)) classes.push('weekend');
    if (!instadate.isSameMonth(date, renderedDate)) classes.push('out-month');

    if (this.constructor.isDateValid(value)) {
      if (instadate.isSameDay(date, value)) classes.push('selected');
    } else if (instadate.isSameDay(date, renderedDate)) {
      classes.push('pre-selected');
    }

    if (this.isMinMaxOut(date, min, max)) classes.push('out-min-max');

    return classes.join(' ');
  }

  getMonthClasses(monthName, value, renderedDate, min, max) {
    const classes = ['monthName'];
    if (this.constructor.isDateValid(value)) {
      const dateByMonth = new Date(
        value.getFullYear(),
        this.props.monthsNames.indexOf(monthName),
        1,
      );
      if (instadate.isSameMonth(dateByMonth, value)) classes.push('selected');
      if (this.isMinMaxOut(dateByMonth, min, max, 'month')) classes.push('out-min-max');
    } else {
      const dateByMonth = new Date(
        renderedDate.getFullYear(),
        this.props.monthsNames.indexOf(monthName),
      );
      if (instadate.isSameMonth(dateByMonth, renderedDate)) classes.push('pre-selected');
    }
    return classes.join(' ');
  }

  getYearClasses(year, value, renderedDate, min, max) {
    const classes = ['yearName'];
    if (this.constructor.isDateValid(value)) {
      const dateByYear = new Date(year, 0, 1);
      if (instadate.isSameYear(dateByYear, value)) classes.push('selected');
      if (this.isMinMaxOut(dateByYear, min, max, 'year')) classes.push('out-min-max');
    } else {
      const dateByYear = new Date(year, 0);
      if (instadate.isSameYear(dateByYear, renderedDate)) classes.push('pre-selected');
    }

    return classes.join(' ');
  }

  isMinMaxOut(date, min, max, accuracy) {
    if (!min && !max) {
      return false;
    }
    if (min && instadate.isAfter(min, this.constructor.normalizeDate(date, accuracy, 'up'))) {
      return true;
    }

    if (max && instadate.isBefore(max, this.constructor.normalizeDate(date, accuracy, 'down'))) {
      return true;
    }

    return false;
  }

  handleClick(e) {
    const { year, month, day } = e.currentTarget.dataset;
    let accuracy;

    if (year) {
      accuracy = 'year';
      this.renderedDate.setFullYear(year);
    }

    if (month) {
      this.renderedDate.setMonth(month);
      accuracy = 'month';
    }

    if (day) {
      accuracy = 'date';
      this.renderedDate.setDate(day);
    }

    if (!this.isMinMaxOut(this.renderedDate, this.state.min, this.state.max)) {
      if (this.props.onChange) {
        this.props.onChange(pureDateFormat(this.renderedDate, this.props.returnFormat), this.props.name);
        if (accuracy === 'date') {
          this.closeDatepickerModal();
        }
      }
    } else if (!this.isMinMaxOut(this.renderedDate, this.state.min, this.state.max, accuracy)) {
      if (this.state.min && instadate.isBefore(this.renderedDate, this.state.min)) {
        this.renderedDate = this.state.min;
      }

      if (this.state.max && instadate.isAfter(this.renderedDate, this.state.max)) {
        this.renderedDate = this.state.max;
      }

      if (this.props.onChange) {
        this.props.onChange(pureDateFormat(this.renderedDate, this.props.returnFormat), this.props.name);
        if (accuracy === 'date') {
          this.closeDatepickerModal();
        }
      }
    }
  }

  clear() {
    this.renderedDate = '';
    this.props.onChange('', this.props.name);
  }

  handleInput() {

  }

  openDatepickerModal(e) {
    e.currentTarget.blur();
    this.refs.datepicker.open();
  }

  closeDatepickerModal() {
    this.refs.datepicker.close();
  }

  render() {
    const {
      today,
      value,
      format,
      weekDaysNamesShort,
      monthsNames,
      years,
      className,
      placeholder,
      inputClassName,
      min,
      max,
      ...modalAttrs
    } = this.props;

    const renderedDate = new Date((
      this.constructor.isDateValid(this.state.value) ? this.state.value : this.state.today
    ).getTime());
    renderedDate.setHours(0, 0, 0, 0);
    this.renderedDate = renderedDate;

    const firsDatetInPeriod = instadate.firstDateInMonth(renderedDate);
    const lastDateInPeriod = instadate.lastDateInMonth(renderedDate);
    const dates = instadate.dates(
      instadate.addDays(firsDatetInPeriod, -firsDatetInPeriod.getDay()),
      instadate.addDays(lastDateInPeriod, 6 - lastDateInPeriod.getDay()));
    const centralYearInPeriod = renderedDate.getFullYear();

    return (
      <div className={className}>
        <input
          type="text"
          onFocus={this.openDatepickerModal}
          className={inputClassName}
          placeholder={placeholder}
          onChange={this.handleInput}
          value={value ? pureDateFormat(this.state.value, format) : ''}
        />
        <ReactPureModal
          width="500px"
          header="Select date"
          ref="datepicker"
          className="react-pure-calendar-modal"
          {...modalAttrs}
        >
          <div className="react-pure-calendar">
            <div className="calendarWrap">
              <div className="weekdays-names">
                {
                  weekDaysNamesShort.map((weekDayName, i) => (
                    <div
                      key={weekDayName}
                      className={`${i === 0 || i === 6 ? 'weekend' : ''} weekDayNameShort`}
                    >{weekDayName}</div>
                  ))
                }
              </div>
              {
                dates.map((dateObject) => {
                  const date = dateObject.getDate();
                  const month = dateObject.getMonth();
                  const year = dateObject.getFullYear();

                  return (
                    <div
                      key={`${month}-${date}`}
                      className={this.getDateClasses(
                        dateObject,
                        this.state.value,
                        renderedDate,
                        this.state.min,
                        this.state.max,
                      )}
                      data-day={date}
                      data-month={month}
                      data-year={year}
                      onClick={this.handleClick}
                    >{date}</div>
                  );
                })
              }
              <br />
              <br />
              <button
                onClick={this.handleClick}
                type="button"
                data-day={this.state.today.getDate()}
                data-month={this.state.today.getMonth()}
                data-year={this.state.today.getFullYear()}
                className="btn btn-block btn-sm btn-default"
              >Today</button>
              <button
                onClick={this.clear}
                type="button"
                className="btn btn-block btn-sm btn-default"
              >Clear</button>
            </div>
            <div>
              {
                monthsNames.map((monthName, index) => (
                  <div
                    key={monthName}
                    data-month={index}
                    onClick={this.handleClick}
                    className={this.getMonthClasses(
                      monthName,
                      this.state.value,
                      renderedDate,
                      this.state.min,
                      this.state.max,
                    )}
                  >{monthName}</div>
                ))
              }
            </div>
            <div>
              {
                this.constructor.getYearsPeriod(centralYearInPeriod, years).map(year => (
                  <div
                    key={year}
                    data-year={year}
                    onClick={this.handleClick}
                    className={this.getYearClasses(
                      year,
                      this.state.value,
                      renderedDate,
                      this.state.min,
                      this.state.max,
                    )}
                  >{year}</div>
                ))
              }
            </div>
          </div>
        </ReactPureModal>
      </div>
    );
  }
}

PureDatepicker.defaultProps = {
  today: new Date(),
  returnFormat: 'Y-m-d H:i:s',
  format: 'd.m.Y',
  monthsNames: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ],
  monthsNamesShort: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],
  weekDaysNames: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ],
  weekDaysNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  years: [-5, 6],
  beginFromDay: 'Sun',
};

PureDatepicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  onChange: PropTypes.func,
  today: PropTypes.instanceOf(Date),
  format: PropTypes.string.isRequired,
  returnFormat: PropTypes.string,
  weekDaysNamesShort: PropTypes.array,
  monthsNames: PropTypes.array,
  years: PropTypes.array,
  className: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  inputClassName: PropTypes.string,
  min: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
  max: PropTypes.oneOfType([
    PropTypes.instanceOf(Date),
    PropTypes.string,
  ]),
};

export default PureDatepicker;
