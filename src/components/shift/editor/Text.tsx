import * as React from 'react';
import { ShiftInputEditor as Input } from './Input';

interface Props {
    onValueChange?: (value: string | null) => void;
    value?: string;
}

export class ShiftTextEditor extends React.PureComponent<Props> {
    public static readonly displayName = 'Shift.TextEditor';

    public render() {
        return (
            <Input onValueChange={this.props.onValueChange} type="text" value={this.props.value} />
        );
    }
}
