import * as PropTypes from 'prop-types';
import * as React from 'react';
import { ValidationError } from 'validate.ts';
import { FormContext, FormContextTypes } from './ContextProvider';

export const FieldContextTypes = {
    editorKey: PropTypes.string.isRequired,
    hasErrors: PropTypes.bool.isRequired,
    validationErrors: PropTypes.arrayOf(PropTypes.instanceOf(ValidationError).isRequired).isRequired,
};

export interface FieldContext {
    editorKey: string;
    hasErrors: boolean;
    validationErrors: ValidationError[];
}

interface Props {
    editorKey: string;
}

interface State {
    validationErrors: ValidationError[];
}

export class ShiftField extends React.Component<Props, State> {
    public static readonly childContextTypes = FieldContextTypes;
    public static readonly contextTypes = FormContextTypes;
    public readonly context: FormContext;

    public constructor(props: Props, context: FormContext) {
        super(props, context);
        this.state = {
            validationErrors: [],
        };
    }

    public componentDidMount() {
        this.context.shift.addField(this.props.editorKey, {
            setValidationErrors: this.setValidationErrors,
        });
    }

    public componentWillUnmount() {
        this.context.shift.removeField(this.props.editorKey);
    }

    private setValidationErrors = (errors: ValidationError[]) => {
        this.setState({ validationErrors: errors });
    };

    public getChildContext() {
        return {
            editorKey: this.props.editorKey,
            hasErrors: this.state.validationErrors.length > 0,
            validationErrors: this.state.validationErrors,
        };
    }

    public render() {
        return this.props.children;
    }
}
