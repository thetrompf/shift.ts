import * as React from 'react';
import { FormContext, FormContextTypes } from '../ContextProvider';
import { FieldContext, FieldContextTypes } from '../Field';
import { ShiftInputEditor as Input } from './Input';

interface Props {
    onChange?: (value: string | null) => void;
    value?: string;
}

export class ShiftPasswordEditor extends React.Component<Props> {
    public static readonly contextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);
    public static readonly isShiftEditor = true;
    public context: FieldContext & FormContext;
    public render() {
        return (
            <Input
                name={this.context.editorKey}
                onChange={this.props.onChange}
                type="password"
                value={this.props.value}
            />
        );
    }
}
