import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';
import { FieldContext, FieldContextTypes } from './Field';

const style = {
    color: 'red',
};

export class FieldError extends React.Component {
    public static readonly contextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);
    public static readonly displayName = 'Shift.FieldError';

    public context: FieldContext & FormContext;
    public render() {
        if (this.context.validationErrors.length > 0) {
            return (
                <div style={style}>
                    <ul>{this.context.validationErrors.map((error, idx) => <li key={idx}>{error.message}</li>)}</ul>
                </div>
            );
        }
        return null;
    }
}
