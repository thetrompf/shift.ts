import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';
import { FieldContext, FieldContextTypes } from './Field';

export interface Props {
    className?: string;
}

export class Label extends React.Component<Props> {
    public static readonly contextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);
    public static displayName = 'Shift.Label';

    public context: FieldContext & FormContext;

    private onClick = (e: React.MouseEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (this.context.tabRegistry != null) {
            this.context.tabRegistry.focus(this.context.editorKey);
        }
    };

    public render() {
        return (
            <label className={this.props.className} htmlFor={this.context.editorKey} onClick={this.onClick}>
                {this.props.children}
            </label>
        );
    }
}
