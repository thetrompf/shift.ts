import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';

export class ShiftReset extends React.Component {
    public static readonly contextTypes = FormContextTypes;
    private refInput: HTMLInputElement | null;
    public readonly context: FormContext;

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add('__ShiftReset', this.focus);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete('__ShiftReset');
        }
    }

    private bindInputRef = (ref: HTMLInputElement) => {
        this.refInput = ref;
    };

    public focus = (): boolean => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    public render() {
        return <input name="__ShiftReset" ref={this.bindInputRef} type="reset" />;
    }
}
