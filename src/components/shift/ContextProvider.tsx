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

export interface Props {
    resetForm: () => void;
    submitForm: () => void;
    tabBoundaryKey?: string;
    tabCycle?: boolean;
}

interface State {}

export interface TabRegistryContext {
    tabRegistry?: TabRegistry;
}

export interface FormContext extends TabRegistryContext {
    shift: {
        cancelLiveValidation: () => void;
        clearValidationErrors: () => void;
        registerEditor: <T>(name: string, context: EditorContext<T>) => void;
        registerField: (name: string, context: FieldContext) => void;
        resetForm: () => void;
        submitForm: () => void;
        triggerChange: (name: string) => void;
        unregisterEditor: (name: string) => void;
        unregisterField: (name: string) => void;
    };
}

export interface EditorContext<T = any> {
    focus: () => boolean;
    getValue: () => T | null;
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
        cancelLiveValidation: PropTypes.func.isRequired,
        clearValidationErrors: PropTypes.func.isRequired,
        registerEditor: PropTypes.func.isRequired,
        registerField: PropTypes.func.isRequired,
        resetForm: PropTypes.func.isRequired,
        submitForm: PropTypes.func.isRequired,
        triggerChange: PropTypes.func.isRequired,
        unregisterEditor: PropTypes.func.isRequired,
        unregisterField: PropTypes.func.isRequired,
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

export class ContextProvider extends React.Component<Props, State> {
    public static readonly childContextTypes = FormContextTypes;
    public static readonly displayName = 'Shift.ContextProvider';

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

    private registerEditor<T>(this: ContextProvider, name: string, editorContext: EditorContext<T>) {
        this.editors.set(name, new ValueProvider(editorContext));
        this.tabRegistry.add(name, editorContext.focus);
    }

    private registerField(this: ContextProvider, name: string, fieldContext: FieldContext) {
        this.fields.set(name, fieldContext);
    }

    private triggerChange(name: string) {
        const valueProvider = this.editors.get(name);
        if (valueProvider != null) {
            valueProvider.emit('change');
        }
    }

    private unregisterEditor(name: string) {
        this.editors.delete(name);
        this.tabRegistry.delete(name);
    }

    private unregisterField(name: string) {
        this.fields.delete(name);
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
                cancelLiveValidation: this.cancelLiveValidation.bind(this),
                clearValidationErrors: this.clearValidationErrors.bind(this),
                registerEditor: this.registerEditor.bind(this),
                registerField: this.registerField.bind(this),
                resetForm: this.resetForm.bind(this),
                submitForm: this.submitForm.bind(this),
                triggerChange: this.triggerChange.bind(this),
                unregisterEditor: this.unregisterEditor.bind(this),
                unregisterField: this.unregisterField.bind(this),
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

    public resetForm = () => {
        this.props.resetForm();
    };

    public setValidationErrors(err: ValidationAggregateError<any>) {
        err.errors.forEach((errors, editorKey) => {
            const fieldContext = this.fields.get(editorKey);
            if (fieldContext != null) {
                this.validationErrors.set(editorKey, errors);
                fieldContext.setValidationErrors(errors);
            }
        });
    }

    public submitForm = () => {
        this.props.submitForm();
    };

    public render() {
        return this.props.children;
    }
}
