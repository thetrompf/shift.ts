import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';
import { FieldContext, FieldContextTypes } from './Field';

export interface Props {
    className?: string;
}

const style = {
    color: 'red',
};

export class FieldError extends React.Component<Props> {
    public static readonly contextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);
    public static readonly displayName = 'Shift.FieldError';

    public context: FieldContext & FormContext;
    public render() {
        if (this.context.validationErrors.length === 1) {
            return (
                <div className={this.props.className} style={style}>
                    {this.context.validationErrors[0].message}
                </div>
            );
        } else if (this.context.validationErrors.length > 1) {
            return (
                <div className={this.props.className} style={style}>
                    <ul>{this.context.validationErrors.map((error, idx) => <li key={idx}>{error.message}</li>)}</ul>
                </div>
            );
        }
        return null;
    }
}
