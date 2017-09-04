import React from 'react';
import { render } from 'react-dom';
import Datepicker from '../dist/react-pure-datepicker.min.js';

class DatepickerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    }
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
        />
      </div>
    );
  }
}

render(<DatepickerContainer />, document.getElementById('js--datepicker'));
