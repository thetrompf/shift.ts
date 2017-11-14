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

    public focus = (): boolean => {
        if (this.refInput == null) {
            return false;
        }
        this.refInput.focus();
        return true;
    };

    public render() {
        if (Children.count(this.props.children) === 0) {
            return <input name="__ShiftSubmit" ref={this.bindInputRef} type="submit" />;
        } else {
            return this.props.children;
        }
    }
}
