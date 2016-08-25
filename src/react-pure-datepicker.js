import React, { Component, PropTypes } from 'react';
import ReactPureModal from 'react-pure-modal';
import instadate from 'instadate';
import { format } from 'react-pure-time';

class PureDatepicker extends Component {
  constructor(props) {
    super(props);
    this.getMonthClasses = this.getMonthClasses.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.openDatepickerModal = this.openDatepickerModal.bind(this);
    this.clear = this.clear.bind(this);
  }

  getYearsPeriod(currentYear, years) {
    const period = [];
    let fromYear = currentYear + years[0];
    const toYear = currentYear + years[1];

    while (fromYear <= toYear) {
      period.push(fromYear);
      fromYear++;
    }
    return period;
  }

  getDateClasses(date, value, renderedDate, min, max) {
    const classes = ['date-cell'];
    if (instadate.isWeekendDate(date)) classes.push('weekend');
    if (!instadate.isSameMonth(date, renderedDate)) classes.push('out-month');

    if (value) {
      if (instadate.isSameDay(date, value)) classes.push('selected');
    } else {
      if (instadate.isSameDay(date, renderedDate)) classes.push('pre-selected');
    }

    if (this.isMinMaxOut(date, min, max)) classes.push('out-min-max');

    return classes.join(' ');
  }

  getMonthClasses(monthName, value, renderedDate, min, max) {
    const classes = ['monthName'];
    if (value) {
      const dateByMonth = new Date(
        value.getUTCFullYear(),
        this.props.monthsNames.indexOf(monthName),
        value.getUTCDate()
      );
      if (instadate.isSameMonth(dateByMonth, value)) classes.push('selected');
      if (this.isMinMaxOut(dateByMonth, min, max, 'month')) classes.push('out-min-max');
    } else {
      const dateByMonth = new Date(
        renderedDate.getUTCFullYear(),
        this.props.monthsNames.indexOf(monthName)
      );
      if (instadate.isSameMonth(dateByMonth, renderedDate)) classes.push('pre-selected');
    }
    return classes.join(' ');
  }

  getYearClasses(year, value, renderedDate, min, max) {
    const classes = ['yearName'];
    if (value) {
      const dateByYear = new Date(year, value.getUTCMonth(), value.getUTCDate());
      if (instadate.isSameYear(dateByYear, value)) classes.push('selected');
      if (this.isMinMaxOut(dateByYear, min, max, 'year')) classes.push('out-min-max');
    } else {
      const dateByYear = new Date(year, 1);
      if (instadate.isSameYear(dateByYear, renderedDate)) classes.push('pre-selected');
    }

    return classes.join(' ');
  }

  normalizeDate(date, accuracy = '', direction = '') {
    switch (`${accuracy}-${direction}`) {
      case 'month-up':
        return instadate.lastDateInMonth(date);
      case 'month-down':
        return instadate.firstDateInMonth(date);
      case 'year-up':
        return new Date(date.getUTCFullYear, 11, 31);
      case 'year-down':
        return new Date(date.getUTCFullYear, 0, 1);
      default:
        return date;
    }
  }

  isMinMaxOut(date, min, max, accuracy) {
    if (!min && !max) {
      return false;
    }
    if (min && instadate.isAfter(min, this.normalizeDate(date, accuracy, 'up'))) {
      return true;
    }

    if (max && instadate.isBefore(max, this.normalizeDate(date, accuracy, 'down'))) {
      return true;
    }

    return false;
  }

  handleClick(e) {
    const { year, month, day } = e.currentTarget.dataset;
    let accuracy;

    if (year) {
      accuracy = 'year';
      this.renderedDate.setUTCFullYear(year);
    }

    if (month) {
      this.renderedDate.setUTCMonth(month);
      accuracy = 'month';
    }

    if (day) {
      accuracy = 'date';
      this.renderedDate.setUTCDate(day);
    }

    if (!this.isMinMaxOut(this.renderedDate, this.props.min, this.props.max)) {
      if (this.props.onChange) {
        this.props.onChange(this.renderedDate, this.props.name);
      }
    } else if (!this.isMinMaxOut(this.renderedDate, this.props.min, this.props.max, accuracy)) {
      if (this.props.min && instadate.isBefore(this.renderedDate, this.props.min)) {
        this.renderedDate = this.props.min;
      }

      if (this.props.max && instadate.isAfter(this.renderedDate, this.props.max)) {
        this.renderedDate = this.props.max;
      }

      if (this.props.onChange) {
        this.props.onChange(this.renderedDate, this.props.name);
      }
    }
  }

  clear() {
    this.renderedDate = '';
    this.props.onChange('', this.props.name);
  }

  handleInput() {

  }

  openDatepickerModal() {
    this.refs.datepicker.open();
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
    } = this.props;


    // TODO перенести нормализацию в получение пропсов
    let min;
    let max;

    if (this.props.min) {
      min = this.props.min instanceof Date ?
        this.props.min : new Date(this.props.min);
    }

    if (this.props.max) {
      max = this.props.max instanceof Date ?
        this.props.max : new Date(this.props.max);
    }

    const renderedDate = instadate.noon(value || today);
    this.renderedDate = renderedDate;

    const firsDatetInPeriod = instadate.firstDateInMonth(renderedDate);
    const lastDateInPeriod = instadate.lastDateInMonth(renderedDate);
    const dates = instadate.dates(
      instadate.addDays(firsDatetInPeriod, -firsDatetInPeriod.getUTCDay()),
      instadate.addDays(lastDateInPeriod, 6 - lastDateInPeriod.getUTCDay()));
    const centralYearInPeriod = renderedDate.getUTCFullYear();

    return (
      <div className={className}>
        <input
          type="text"
          onFocus={this.openDatepickerModal}
          className={inputClassName}
          placeholder={placeholder}
          onChange={this.handleInput}
          value={value ? pureDateFormat(value, format) : value}
        />
        <ReactPureModal
          header="Select date"
          ref="datepicker"
          className="react-pure-calendar-modal"
        >
          <div className="react-pure-calendar row-fit">
            <div className="calendarWrap top">
              <div>
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
                dates.map((date) => {
                  const UTCDate = date.getUTCDate();
                  const UTCMonth = date.getUTCMonth();
                  const UTCYear = date.getUTCFullYear();

                  return (
                    <div
                      key={`${UTCMonth}-${UTCDate}`}
                      className={this.getDateClasses(date, value, renderedDate, min, max)}
                      data-day={UTCDate}
                      data-month={UTCMonth}
                      data-year={UTCYear}
                      onClick={this.handleClick}
                    >{UTCDate}</div>
                  );
                })
              }
              <br />
              <br />
              <button
                onClick={this.handleClick}
                type="button"
                data-day={today.getUTCDate()}
                data-month={today.getUTCMonth()}
                data-year={today.getUTCFullYear()}
                className="btn btn-block btn-sm btn-default"
              >Today</button>
              <button
                onClick={this.clear}
                type="button"
                className="btn btn-block btn-sm btn-default"
              >Clear</button>
            </div>
            <div className="top">
              {
                monthsNames.map((monthName, index) => (
                  <div
                    key={monthName}
                    data-month={index}
                    onClick={this.handleClick}
                    className={this.getMonthClasses(monthName, value, renderedDate, min, max)}
                  >{monthName}</div>
                ))
              }
            </div>
            <div className="top">
              {
                this.getYearsPeriod(centralYearInPeriod, years).map(year => (
                  <div
                    key={year}
                    data-year={year}
                    onClick={this.handleClick}
                    className={this.getYearClasses(year, value, renderedDate, min, max)}
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
