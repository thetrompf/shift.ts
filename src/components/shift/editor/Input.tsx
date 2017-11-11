import * as React from 'react';
import { ValidationError } from 'validate.ts';
import { Context as ShiftContext, ContextTypes as ShiftContextTypes } from '../Context';

interface Props {
    name: string;
    onChange?: (value: string | null) => void;
    // tslint:disable-next-line:no-reserved-keywords
    type?: 'text' | 'password';
    value?: string;
}

interface State {
    validationErrors: ValidationError[];
    value: string | null;
}

const ContextTypes = Object.assign({}, ShiftContextTypes);

export class ShiftInputEditor extends React.Component<Props, State> {
    public static contextTypes = ContextTypes;

    private refInput: HTMLInputElement | null;
    public context: ShiftContext;

    public constructor(props: Props, context: ShiftContext) {
        super(props, context);
        this.state = {
            validationErrors: [],
            value: props.value || null,
        };
    }

    public componentDidMount() {
        this.context.shift.addEditor(this.props.name, {
            focus: this.focus,
            getValue: this.getValue,
            setValidationErrors: this.setValidationErrors,
        });
    }

    public componentWillUnmount() {
        this.context.shift.removeEditor(this.props.name);
    }

    private bindInputRef = (ref: HTMLInputElement) => {
        this.refInput = ref;
    };

    private focus = () => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    private getValue = () => this.state.value;

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim();
        this.setState((prevState, props) => {
            return {
                value: value === '' ? null : value,
            };
        }, this.propagateChange);
    };

    private propagateChange = () => {
        if (this.props.onChange) {
            this.props.onChange(this.state.value);
        }
    };

    private setValidationErrors = (errors: ValidationError[]) => {
        this.setState({
            validationErrors: errors,
        });
    };

    public render() {
        const style =
            this.state.validationErrors.length === 0
                ? undefined
                : {
                      border: '1px solid red',
                  };
        return (
            <input
                key={this.props.name}
                name={this.props.name}
                onChange={this.onChange}
                ref={this.bindInputRef}
                style={style}
                type={this.props.type}
                value={this.state.value || ''}
            />
        );
    }
}
