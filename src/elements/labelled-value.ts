import { Row } from './row';
import { Text } from './text';

export class LabelledValue extends Row {
  public label: string;
  public value: number;

  constructor(
    label: string,
    value: number,
    widthPercents?: number[],
    maxWidth?: number
  ) {
    super(
      0,
      0,
      [
        new Text(0, 0, label),
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
