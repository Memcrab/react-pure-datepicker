/* @flow */
import React, { Component } from 'react';
import { render } from 'react-dom';
import Datepicker from '../dist/react-pure-datepicker.min.js';

type Props = Object;
type State = {|
  value: string,
|};

class DatepickerContainer extends Component<Props, State> {
  constructor(props: Props) {
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

const element: ?Element = document.getElementById('js--datepicker');

if (element instanceof HTMLElement) {
  render(<DatepickerContainer />, element);
}
