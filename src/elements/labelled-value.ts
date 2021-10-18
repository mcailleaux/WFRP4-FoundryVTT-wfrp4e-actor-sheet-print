import { Row } from './row';
import { Text } from './text';
import { MultilineText } from './multiline-text';

export class LabelledValue extends Row {
  public label: string;
  public value: number;

  constructor(
    label: string,
    value: number,
    widthPercents?: number[],
    multiline = false,
    maxWidth?: number
  ) {
    super(
      0,
      0,
      [
        multiline ? new MultilineText(0, 0, label) : new Text(0, 0, label),
        new Text(0, 0, value.toString(), {
          align: 'right',
        }),
      ],
      maxWidth,
      widthPercents,
      []
    );
    this.label = label;
    this.value = value;
  }
}
