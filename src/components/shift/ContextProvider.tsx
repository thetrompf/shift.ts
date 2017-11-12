import { TabRegistry } from '@secoya/tab-navigation.ts';
import { EventEmitter } from 'events';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import {
    liveValidate,
    Constraints,
    ILiveValidationChangeMap,
    SubscriptionCanceller,
    ValidationAggregateError,
    ValidationError,
} from 'validate.ts';

interface Props {
    tabBoundaryKey?: string;
    tabCycle?: boolean;
}

interface State {}

export interface TabRegistryContext {
    tabRegistry?: TabRegistry;
}

export interface FormContext extends TabRegistryContext {
    shift: {
        addEditor: <T>(name: string, context: EditorContext<T>) => void;
        addField: (name: string, context: FieldContext) => void;
        cancelLiveValidation: () => void;
        clearValidationErrors: () => void;
        removeEditor: (name: string) => void;
        removeField: (name: string) => void;
        triggerChange: (name: string) => void;
    };
}

export interface EditorContext<T = any> {
    focus: () => boolean;
    getValue: () => T;
    setValue: (value: T | null) => void;
}

export interface FieldContext {
    setValidationErrors: (errors: ValidationError[]) => void;
}

export const TabRegistryContextTypes = {
    tabRegistry: PropTypes.instanceOf(TabRegistry),
};

export const FormContextTypes = Object.assign({}, TabRegistryContextTypes, {
    shift: PropTypes.shape({
        addEditor: PropTypes.func.isRequired,
        addField: PropTypes.func.isRequired,
        cancelLiveValidation: PropTypes.func.isRequired,
        clearValidationErrors: PropTypes.func.isRequired,
        removeEditor: PropTypes.func.isRequired,
        removeField: PropTypes.func.isRequired,
        triggerChange: PropTypes.func.isRequired,
    }),
});

class ValueProvider<T = any> extends EventEmitter {
    public constructor(public context: EditorContext<T>) {
        super();
    }

    public focus() {
        return this.context.focus();
    }

    public getValue() {
        return this.context.getValue();
    }

    public setValue(value: T | null): void {
        this.context.setValue(value);
    }
}

export class ShiftContextProvider extends React.Component<Props, State> {
    public static readonly childContextTypes = FormContextTypes;

    private liveValidationSubscription: SubscriptionCanceller | null;

    private validationErrors: Map<string, ValidationError[]>;

    public readonly context: TabRegistryContext | undefined;

    public readonly editors: Map<string, ValueProvider>;
    public readonly fields: Map<string, FieldContext>;
    public readonly tabRegistry: TabRegistry<any>;

    public constructor(props: Props) {
        super(props);
        this.editors = new Map();
        this.fields = new Map();
        this.tabRegistry = new TabRegistry({ cycle: !!props.tabCycle });
        this.validationErrors = new Map();
    }

    public componentDidMount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.add(this.props.tabBoundaryKey, this.tabRegistry);
        }
    }

    public componentWillUnmount() {
        if (this.context != null && this.context.tabRegistry != null) {
            this.context.tabRegistry.delete(this.props.tabBoundaryKey);
        }
    }

    private addEditor<T>(this: ShiftContextProvider, name: string, editorContext: EditorContext<T>) {
        this.editors.set(name, new ValueProvider(editorContext));
        this.tabRegistry.add(name, editorContext.focus);
    }

    private addField(this: ShiftContextProvider, name: string, fieldContext: FieldContext) {
        this.fields.set(name, fieldContext);
    }

    private liveValidationChangeHandler = (err: ILiveValidationChangeMap<any, ValidationError>) => {
        err.forEach((errors, editorKey) => {
            const fieldContext = this.fields.get(editorKey);
            if (errors.length > 0) {
                if (fieldContext != null) {
                    this.validationErrors.set(editorKey, errors);
                    fieldContext.setValidationErrors(errors);
                }
            } else {
                if (this.validationErrors.has(editorKey)) {
                    this.validationErrors.delete(editorKey);
                }
                if (fieldContext != null) {
                    fieldContext.setValidationErrors([]);
                }
            }
        });
    };

    private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Tab' && e.target != null && (e.target as any).name != null) {
            const name = (e.target as any).name as string;
            e.preventDefault();
            e.stopPropagation();
            if (e.shiftKey) {
                this.tabRegistry.focusPrev(name);
            } else {
                this.tabRegistry.focusNext(name);
            }
        }
    };

    private removeEditor(name: string) {
        this.editors.delete(name);
        this.tabRegistry.delete(name);
    }

    private removeField(name: string) {
        this.fields.delete(name);
    }

    private triggerChange(name: string) {
        const valueProvider = this.editors.get(name);
        if (valueProvider != null) {
            valueProvider.emit('change');
        }
    }

    public cancelLiveValidation() {
        if (this.liveValidationSubscription != null) {
            this.liveValidationSubscription();
            this.liveValidationSubscription = null;
        }
    }

    public clearValidationErrors() {
        if (this.validationErrors.size > 0) {
            this.validationErrors.forEach((errors, editorKey) => {
                const fieldContext = this.fields.get(editorKey);
                if (fieldContext != null) {
                    fieldContext.setValidationErrors([]);
                }
            });
            this.validationErrors.clear();
        }
    }

    public clearValues() {
        this.editors.forEach(editor => {
            editor.setValue(null);
        });
    }

    public getChildContext() {
        return {
            shift: {
                addEditor: this.addEditor.bind(this),
                addField: this.addField.bind(this),
                cancelLiveValidation: this.cancelLiveValidation.bind(this),
                clearValidationErrors: this.clearValidationErrors.bind(this),
                removeEditor: this.removeEditor.bind(this),
                removeField: this.removeField.bind(this),
                triggerChange: this.triggerChange.bind(this),
            },
            tabRegistry: this.tabRegistry,
        };
    }

    public getValues() {
        const result = {};
        this.editors.forEach((value, key) => {
            result[key] = value.context.getValue();
        });
        return result;
    }

    public liveValidate(constraints: Constraints<any>) {
        if (this.liveValidationSubscription != null) {
            return;
        }
        const valueProviders: { [key: string]: ValueProvider } = {};
        this.editors.forEach((value, key) => {
            valueProviders[key] = value;
        });
        this.liveValidationSubscription = liveValidate(
            valueProviders,
            constraints as any,
            this.liveValidationChangeHandler,
        );
    }

    public setValidationErrors(err: ValidationAggregateError<any>) {
        err.errors.forEach((errors, editorKey) => {
            const fieldContext = this.fields.get(editorKey);
            if (fieldContext != null) {
                this.validationErrors.set(editorKey, errors);
                fieldContext.setValidationErrors(errors);
            }
        });
    }

    public render() {
        return <div onKeyDown={this.onKeyDown}>{this.props.children}</div>;
    }
}
