import * as React from 'react';
import { FormContext, FormContextTypes, TabRegistryContext, TabRegistryContextTypes } from './ContextProvider';
import { FieldContext, FieldContextTypes } from './Field';
import { getDisplayName } from './util';

export interface EditorConstructor {
    new(...args: any[]): CustomEditor;
}

export interface IEditor {
    focus: () => boolean;
    getValue: () => any | null;
    onValueChange: (value: any) => void;
    setValue: (value: any) => void;
}

abstract class CustomEditor extends React.Component<{}> implements IEditor {
    public context: FormContext & FieldContext;
    public abstract focus(): boolean;
    public abstract getValue(): any;
    public abstract onValueChange(value: any): void;
    public abstract setValue(value: any): void;
}

export interface RendererProps {
    onValueChange?: (value: any) => void;
    render: (opts: {
        focusNext: () => void;
        focusPrev: () => void;
        onValueChange: (value: any) => void;
        registerEditor: FormContext['shift']['registerEditor'];
        unregisterEditor: FormContext['shift']['unregisterEditor'];
    }) => JSX.Element;
}

export class ShiftEditorRenderer extends React.Component<RendererProps> {
    public static readonly contextTypes = Object.assign({}, FormContextTypes, FieldContextTypes);
    public static readonly displayName = 'Shift.EditorRenderer';

    public context: FormContext & FieldContext;

    private focusNext = () => {
        if (this.context.tabRegistry) {
            this.context.tabRegistry.focusNext(this.context.editorKey);
        }
    }

    private focusPrev = () => {
        if (this.context.tabRegistry) {
            this.context.tabRegistry.focusPrev(this.context.editorKey);
        }
    };

    private onValueChange = (value: any) => {
        if (this.props.onValueChange != null) {
            this.props.onValueChange(value);
        }
        this.context.shift.triggerChange(this.context.editorKey);
    }

    public render() {
        return this.props.render({
            focusNext: this.focusNext,
            focusPrev: this.focusPrev,
            onValueChange: this.onValueChange,
            registerEditor: this.context.shift.registerEditor,
            unregisterEditor: this.context.shift.unregisterEditor,
        });
    }

}

export interface EditorProps {
    onValueChange: (value: any) => void;
    registerEditor: FormContext['shift']['registerEditor'];
    unregisterEditor: FormContext['shift']['unregisterEditor'];
}

export function ShiftEditor<CProps>(
    Comp: React.ReactType<CProps>,
    WrapperElement: string = 'div',
): React.ComponentClass<CProps & EditorProps> {
    return class extends React.Component<CProps & EditorProps> {
        public static readonly contextTypes = Object.assign({}, FormContextTypes, FieldContextTypes);
        public static readonly displayName = `Shift.Editor(${getDisplayName(Comp)})`;
        public context: FormContext & FieldContext;

        private onValueChange = (value: any) => {
            if (this.props.onValueChange != null) {
                this.props.onValueChange(value);
            }
            this.context.shift.triggerChange(this.context.editorKey);
        }

        public render() {
            const props = this.props;
            return (
                <Comp
                    {...props}
                    onValueChange={this.onValueChange}
                    registerEditor={this.context.shift.registerEditor}
                    unregisterEditor={this.context.shift.unregisterEditor}
                />
            );
        }
    }
}

const TabbableContextTypes = Object.assign({}, FieldContextTypes, TabRegistryContextTypes);

export function ShiftTabbable<CProps>(
    Comp: React.ReactType<CProps>,
    WrapperElement: string = 'span',
): React.ComponentClass<CProps> {
    return class extends React.Component<CProps> {
        public static readonly contextTypes = TabbableContextTypes
        public static readonly displayName = `Shift.Tabbable(${getDisplayName(Comp)})`;
        public context: FieldContext & TabRegistryContext;

        private focusNext = () => {
            if (this.context.tabRegistry != null) {
                this.context.tabRegistry.focusNext(this.context.editorKey);
            }
        }

        private focusPrev = () => {
            if (this.context.tabRegistry != null) {
                this.context.tabRegistry.focusPrev(this.context.editorKey);
            }
        }

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
        }

        public render() {
            const props = this.props;
            return (
                <WrapperElement onKeyDown={this.onKeyDown}>
                    <Comp {...props} />
                </WrapperElement>
            );
        }
    }
}

function componentDidMountDecorator(oldImpl: any) {
    return function (this: CustomEditor, ...args: any[]) {
        if (oldImpl != null) {
            oldImpl.apply(this, args);
        }
        this.context.shift.registerEditor(this.context.editorKey, {
            focus: this.focus,
            getValue: this.getValue,
            setValue: this.setValue,
        });
    };
}

function componentWillUnmountDecorator(oldImpl: any) {
    return function (this: CustomEditor, ...args: any[]) {
        this.context.shift.unregisterEditor(this.context.editorKey);
        if (oldImpl != null) {
            oldImpl.apply(this, args);
        }
    }
}

function contextTypesDecorator(oldImpl: any) {
    return Object.assign({}, (oldImpl || {}), FieldContextTypes, FormContextTypes);
}

function onValueChangeDecorator(oldImpl: any) {
    return function (this: CustomEditor, value: any): void {
        if (oldImpl != null) {
            oldImpl.apply(this, arguments);
        }
        this.context.shift.triggerChange(this.context.editorKey);
    };
}

function decorate(target: any, propertyKey: string, decorator: (oldImpl: any) => any) {
    const descriptor = Object.getOwnPropertyDescriptor(target, propertyKey);
    Object.defineProperty(
        target,
        propertyKey,
        {
            value: decorator(descriptor == null ? undefined : descriptor.value),
        },
    );
}

export default function ShifEditor<TEditor extends EditorConstructor>(
    // tslint:disable-next-line:no-duplicate-parameter-names no-reserved-keywords
    constructor: TEditor,
): TEditor {
    decorate(
        constructor.prototype,
        'componentDidMount',
        componentDidMountDecorator,
    );

    decorate(
        constructor.prototype,
        'componentWillUnmount',
        componentWillUnmountDecorator,
    );

    decorate(
        constructor.prototype,
        'onValueChange',
        onValueChangeDecorator,
    );

    decorate(
        constructor,
        'contextTypes',
        contextTypesDecorator,
    );

    Object.defineProperty(
        constructor,
        'displayName',
        {
            value: `Shift.Editor(${getDisplayName(constructor)})`,
        },
    );

    return constructor as any;
}
