import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';

export class ShiftReset extends React.Component {
    public static readonly contextTypes = FormContextTypes;
    public static readonly displayName = 'Shift.Reset';

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

    private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Tab') {
            if (this.context.tabRegistry != null) {
                e.preventDefault();
                e.stopPropagation();
                if (e.shiftKey) {
                    this.context.tabRegistry.focusPrev('__ShiftReset');
                } else {
                    this.context.tabRegistry.focusNext('__ShiftReset');
                }
            }
        }
    }

    public focus = (): boolean => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    public render() {
        return <input onKeyDown={this.onKeyDown} ref={this.bindInputRef} type="reset" />;
    }
}
