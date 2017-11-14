import * as React from 'react';
import { FormContext, FormContextTypes } from './ContextProvider';

export interface Props {
    className?: string;
}

export class Reset extends React.Component<Props> {
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
    };

    public focus = (): boolean => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    public render() {
        return (
            <input className={this.props.className} onKeyDown={this.onKeyDown} ref={this.bindInputRef} type="reset" />
        );
    }
}

export interface RendererProps {
    render(opts: {
        onReset: (e: React.MouseEvent<HTMLElement>) => void;
        registerFocusHandler: (focus: () => boolean) => void;
    }): JSX.Element;
}

export class ResetRenderer extends React.Component<RendererProps> {
    public static readonly contextTypes = FormContextTypes;
    public static readonly displayName = 'Shift.ResetRenderer';

    private focus: null | (() => boolean);

    public readonly context: FormContext;
    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add('__ShiftReset', this.doFocus);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete('__ShiftReset');
        }
    }

    private doFocus = () => {
        if (this.focus == null) {
            return false;
        } else {
            return this.focus();
        }
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
    };

    private onReset = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        this.context.shift.resetForm();
    };

    private registerFocusHandler = (focus: () => boolean) => {
        this.focus = focus;
    };

    public render() {
        return (
            <span onKeyDown={this.onKeyDown}>
                {this.props.render({
                    onReset: this.onReset,
                    registerFocusHandler: this.registerFocusHandler,
                })}
            </span>
        );
    }
}
