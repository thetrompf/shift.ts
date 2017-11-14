import * as React from 'react';
import { TabRegistryContext, TabRegistryContextTypes } from './ContextProvider';
import { FieldContext, FieldContextTypes } from './Field';
import { getDisplayName } from './util';

const TabbableContextTypes = Object.assign({}, FieldContextTypes, TabRegistryContextTypes);

export function TabbableHOC<CProps>(
    Comp: React.ReactType<CProps>,
    WrapperElement: string = 'span',
): React.ComponentClass<CProps> {
    return class extends React.Component<CProps> {
        public static readonly contextTypes = TabbableContextTypes;
        public static readonly displayName = `Shift.Tabbable(${getDisplayName(Comp)})`;
        public context: FieldContext & TabRegistryContext;

        private focusNext = () => {
            if (this.context.tabRegistry != null) {
                this.context.tabRegistry.focusNext(this.context.editorKey);
            }
        };

        private focusPrev = () => {
            if (this.context.tabRegistry != null) {
                this.context.tabRegistry.focusPrev(this.context.editorKey);
            }
        };

        private onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
            if (e.key === 'Tab') {
                e.stopPropagation();
                e.preventDefault();
                if (e.shiftKey) {
                    this.focusPrev();
                } else {
                    this.focusNext();
                }
            }
        };

        public render() {
            const props = this.props;
            return (
                <WrapperElement onKeyDown={this.onKeyDown}>
                    <Comp {...props} />
                </WrapperElement>
            );
        }
    };
}
