import * as React from 'react';
import { FormContext, FormContextTypes } from '../ContextProvider';
import Editor, { IEditor, ShiftTabbable as Tabbable } from '../Editor';
import { FieldContext, FieldContextTypes } from '../Field';

export interface Props {
    onValueChange?: (value: string | null) => void;
    // tslint:disable-next-line:no-reserved-keywords
    type?: string;
    value?: string | null;
}

export interface State {
    value: string;
}

export class ShiftInputComponent extends React.PureComponent<Props, State> implements IEditor {
    public static readonly contextTypes = Object.assign({}, FieldContextTypes, FormContextTypes);
    public static readonly displayName = 'Shift.InputComponent';

    private refInput: HTMLInputElement | null;
    public context: FormContext & FieldContext;

    public constructor(props: Props, context?: any) {
        super(props, context);
        this.state = {
            value: props.value || '',
        };
    }

    private bindInputRef = (ref: HTMLInputElement) => {
        this.refInput = ref;
    };

    private onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        this.setState({ value });
    }

    public componentDidUpdate(prevState: State) {
        if (prevState.value !== this.state.value) {
            this.onValueChange(this.getValue());
        }
    }

    public focus = () => {
        if (this.refInput != null) {
            this.refInput.focus();
            return true;
        }
        return false;
    };

    public getValue = () => {
        const value = this.state.value.trim();
        if (value === '') {
            return null;
        }
        return value;
    };

    public onValueChange(value: string | null) {
        if (this.props.onValueChange != null) {
            this.props.onValueChange(value);
        }
    }

    public render() {
        return (
            <input
                onChange={this.onChange}
                ref={this.bindInputRef}
                type={this.props.type}
                value={this.state.value}
            />
        );
    }

    public setValue = (value: string | null) => {
        this.setState({ value: value || '' });
    };
}

export const ShiftInputEditor = Tabbable(Editor(ShiftInputComponent));
