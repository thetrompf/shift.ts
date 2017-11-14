import * as React from 'react';
import { InputEditor as Input } from './Input';

interface Props {
    onValueChange?: (value: string | null) => void;
    placeholder?: string;
    value?: string;
}

export class TextEditor extends React.PureComponent<Props> {
    public static readonly displayName = 'Shift.TextEditor';

    public render() {
        return (
            <Input
                onValueChange={this.props.onValueChange}
                placeholder={this.props.placeholder}
                type="text"
                value={this.props.value}
            />
        );
    }
}
