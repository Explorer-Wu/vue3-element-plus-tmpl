export interface Item {
  type: 'input' | 'textarea' | 'select' | 'rangedate' | 'time' | 'button' | 'switch' | 'checkgroup' | 'radiogroup';
  size: string;
  field?: string;
  label?: string | Array<String>;
  btnType?: string;
  required?: boolean
  // rule?: any
  class?: string;
  options?: string[] | Array<{ label: string; value: any }>;
  hideLabel?: boolean;
  icon?: boolean;
  default?: any;
}
