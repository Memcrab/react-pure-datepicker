/* @flow */

export type Accuracy = 'month' | 'year' | string;

export type Direction = 'up' | 'down' | string;

export type Props = {|
  value: Date | string,
  onChange: Function,
  onFocus: Function,
  today: Date,
  format: string,
  returnFormat: string,
  weekDaysNamesShort: string[],
  monthsNames: string[],
  years: number[],
  className: string,
  disabled: boolean,
  required: boolean,
  name: string,
  placeholder: string,
  inputClassName: string,
  min: Date | string,
  max: Date | string,
|};

export type Value = ?Date;

export type RenderedDate = Date;

export type State = {
  value: Value,
  min: ?Date,
  max: ?Date,
  today: ?Date,
};

export type MouseClick = SyntheticMouseEvent<HTMLDivElement> & {
  currentTarget: HTMLDivElement,
};
