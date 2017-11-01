/* @flow */

export type MouseClick = SyntheticMouseEvent<HTMLDivElement> & {
  currentTarget: HTMLDivElement,
};

export type Accuracy = 'month' | 'year' | string;

export type Direction = 'up' | 'down' | string;

export type Name = ?string;
export type Format = string;

export type OnChange = (Format, Name) => ?mixed;
export type OnFocus = (e: MouseClick) => ?mixed;

type Array7 = [string, string, string, string, string, string];
type Array5 = [string, string, string, string];

export type MonthsNames = Array7 & Array5;
export type WeekDaysNames = Array7;

export type Props = {|
  value: Date | string,
  onChange: OnChange,
  onFocus?: OnFocus,
  today: Date,
  format: Format,
  returnFormat: string,
  weekDaysNamesShort: WeekDaysNames,
  monthsNames: MonthsNames,
  years: number[],
  className?: string,
  disabled?: boolean,
  required?: boolean,
  name?: Name,
  placeholder?: string,
  inputClassName?: string,
  min?: Date | string,
  max?: Date | string,
  beginFromDay: number,
|};

export type RenderedDate = Date;

export type Value = ?Date;
export type Min = ?Date;
export type Max = ?Date;
export type Today = ?Date;

export type State = {
  value: Value,
  min: Min,
  max: Max,
  today: Today,
};
