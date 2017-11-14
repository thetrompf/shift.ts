import * as React from 'react';
import { ShiftInputEditor as Input } from './Input';

interface Props {
    onValueChange?: (value: string | null) => void;
    value?: string;
}

export class ShiftPasswordEditor extends React.PureComponent<Props> {
    public static readonly displayName = 'Shift.PasswordEditor';

    public render() {
        return (
            <Input
                onValueChange={this.props.onValueChange}
                type="password"
                value={this.props.value}
            />
        );
    }
}
