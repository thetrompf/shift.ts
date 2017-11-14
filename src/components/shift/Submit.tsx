import * as React from 'react';
import { FormContext, FormContextTypes, TabRegistryContext, TabRegistryContextTypes } from './ContextProvider';

export interface Props {
    className?: string;
}

export class Submit extends React.Component<Props> {
    public static readonly contextTypes = TabRegistryContextTypes;
    public static readonly displayName = 'Shift.Submit';

    private refInput: HTMLInputElement | null;
    public readonly context: TabRegistryContext;

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add('__ShiftSubmit', this.focus);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete('__ShiftSubmit');
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
                    this.context.tabRegistry.focusPrev('__ShiftSubmit');
                } else {
                    this.context.tabRegistry.focusNext('__ShiftSubmit');
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
            <input className={this.props.className} onKeyDown={this.onKeyDown} ref={this.bindInputRef} type="submit" />
        );
    }
}

export interface RendererProps {
    render(opts: {
        onSubmit: (e: React.MouseEvent<HTMLElement>) => void;
        registerFocusHandler: (focus: () => boolean) => void;
    }): JSX.Element;
}

export class SubmitRenderer extends React.Component<RendererProps> {
    public static readonly contextTypes = FormContextTypes;
    public static readonly displayName = 'Shift.SubmitRenderer';

    private focus: null | (() => boolean);

    public readonly context: FormContext;
    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add('__ShiftSubmit', this.doFocus);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete('__ShiftSubmit');
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
                    this.context.tabRegistry.focusPrev('__ShiftSubmit');
                } else {
                    this.context.tabRegistry.focusNext('__ShiftSubmit');
                }
            }
        }
    };

    private onSubmit = (e: React.MouseEvent<HTMLElement>) => {
        e.stopPropagation();
        e.preventDefault();
        this.context.shift.submitForm();
    };

    private registerFocusHandler = (focus: () => boolean) => {
        this.focus = focus;
    };

    public render() {
        return (
            <span onKeyDown={this.onKeyDown}>
                {this.props.render({
                    onSubmit: this.onSubmit,
                    registerFocusHandler: this.registerFocusHandler,
                })}
            </span>
        );
    }
}
