import * as React from 'react';
import { FormContext, FormContextTypes } from '../ContextProvider';
import { FieldContext, FieldContextTypes } from '../Field';

interface Props {
    name: string;
    onChange?: (value: string | null) => void;
    // tslint:disable-next-line:no-reserved-keywords
    type?: 'text' | 'password';
    value?: string;
}

interface State {
    value: string | null;
}

const ContextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);

export class ShiftInputEditor extends React.Component<Props, State> {
    public static contextTypes = ContextTypes;
    public static readonly isShiftEditor = true;

    private refInput: HTMLInputElement | null;
    public readonly context: FieldContext & FormContext;

    public constructor(props: Props, context: FieldContext & FormContext) {
        super(props, context);
        this.state = {
            value: props.value || null,
        };
    }

    public componentDidMount() {
        this.context.shift.addEditor(this.props.name, {
            focus: this.focus,
            getValue: this.getValue,
            setValue: this.setValue,
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
        this.context.shift.triggerChange(this.context.editorKey);
    };

    private setValue = (value: string | null): void => {
        this.setState({ value: value });
    };

    public render() {
        const style = this.context.hasErrors
            ? {
                  border: '1px solid red',
              }
            : undefined;
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
