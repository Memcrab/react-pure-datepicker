import React from 'react';
import { render } from 'react-dom';
import Datepicker from '../dist/react-pure-datepicker.min.js';

class DatepickerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
  }

  render() {
    return (
      <div>
        <Datepicker
          value={this.state.value}
          onChange={(value) => {
            console.log('value =>', value);
            this.setState({ value });
          }}
          applyBtn
          applyBtnClassName="apply-btn"
          clearBtn={false}
          format="Y-m-d"
          returnFormat="Y-m-d"
          weekDaysNamesShort={['Нд', 'Пн', 'Вт', 'Wed', 'Thu', 'Fri', 'Sat']}
          beginFromDay={1}
          min={new Date('Fri Oct 28 2012 13:08:52 GMT+0300 (EEST)')}
          max={new Date('Fri Oct 30 2012 13:08:52 GMT+0300 (EEST)')}
        />
      </div>
    );
  }
}

render(<DatepickerContainer />, document.getElementById('js--datepicker'));
