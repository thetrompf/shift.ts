import * as React from 'react';
import { InputEditor as Input } from './Input';

interface Props {
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    value?: string;
}

export class PasswordEditor extends React.PureComponent<Props> {
    public static readonly displayName = 'Shift.PasswordEditor';

    public render() {
        return (
            <Input
                onValueChange={this.props.onValueChange}
                placeholder={this.props.placeholder}
                type="password"
                value={this.props.value}
            />
        );
    }
}
