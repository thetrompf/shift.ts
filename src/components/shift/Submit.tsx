import * as React from 'react';
const Children = React.Children;
import { TabRegistryContext, TabRegistryContextTypes } from './ContextProvider';

export class ShiftSubmit extends React.Component {
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
    }

    public focus = (): boolean => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    public render() {
        if (Children.count(this.props.children) === 0) {
            return <input onKeyDown={this.onKeyDown} ref={this.bindInputRef} type="submit" />;
        } else {
            return this.props.children;
        }
    }
}
