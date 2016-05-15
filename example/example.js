import React from 'react';
import { render } from 'react-dom';
import Datepicker from '../dist/react-pure-datepicker.min.js';

class DatepickerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.openModal = this.openModal.bind(this);
  }

  openModal() {
    this.modal.open();
  }

  render() {
    return (
      <div>
        <Datepicker />
      </div>
    );
  }
}

render(<DatepickerContainer />, document.getElementById('js--datepicker'));
