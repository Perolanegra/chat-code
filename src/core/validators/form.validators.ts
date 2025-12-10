/**
 * form.validators.ts
 *
 * Decorators + helpers para criar FormGroups a partir de classes anotadas,
 * usando apenas o ecossistema do Angular (Reactive Forms / Validators).
 *
 * - Sem libs externas
 * - Inclui validadores BR (CPF, CNPJ, CEP, Telefone)
 * - Inclui mapper de mensagens de erro (para usar no template)
 *
 * Pré-requisito: habilitar experimentalDecorators no tsconfig.json.
 */

import {
  AbstractControl,
  AsyncValidatorFn,
  FormControl,
  FormGroup,
  ValidatorFn,
  Validators,
} from '@angular/forms';

/** Tipo do updateOn do Angular */
export type UpdateOn = 'change' | 'blur' | 'submit';

/** Metadados por propriedade */
interface PropMeta {
  validators: ValidatorFn[];
  asyncValidators: AsyncValidatorFn[];
  updateOn?: UpdateOn;
  defaultValue?: any;
  nonNullable?: boolean;
}

/** Metadados por classe */
interface ClassMeta {
  props: Map<string, PropMeta>;
  groupValidators: ValidatorFn[];
  groupAsyncValidators: AsyncValidatorFn[];
}

/** Storage dos metadados (por constructor) */
const META = new WeakMap<Function, ClassMeta>();

function ensureClassMeta(ctor: Function): ClassMeta {
  let meta = META.get(ctor);
  if (!meta) {
    meta = { props: new Map(), groupValidators: [], groupAsyncValidators: [] };
    META.set(ctor, meta);
  }
  return meta;
}

function ensurePropMeta(ctor: Function, prop: string): PropMeta {
  const classMeta = ensureClassMeta(ctor);
  let propMeta = classMeta.props.get(prop);
  if (!propMeta) {
    propMeta = { validators: [], asyncValidators: [] };
    classMeta.props.set(prop, propMeta);
  }
  return propMeta;
}

function pushValidator(ctor: Function, prop: string, v: ValidatorFn): void {
  const pm = ensurePropMeta(ctor, prop);
  pm.validators.push(v);
}

function pushAsyncValidator(ctor: Function, prop: string, v: AsyncValidatorFn): void {
  const pm = ensurePropMeta(ctor, prop);
  pm.asyncValidators.push(v);
}

/*** ---------------------------
 *  Decorators de propriedade (Angular Validators)
 *  --------------------------- */

export function Required(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.required);
  };
}

export function RequiredTrue(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.requiredTrue);
  };
}

export function MinLength(min: number): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.minLength(min));
  };
}

export function MaxLength(max: number): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.maxLength(max));
  };
}

export function Email(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.email);
  };
}

export function Pattern(pattern: string | RegExp): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.pattern(pattern));
  };
}

export function Min(min: number): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.min(min));
  };
}

export function Max(max: number): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), Validators.max(max));
  };
}

/** Permite adicionar qualquer ValidatorFn personalizado */
export function WithValidator(...validators: ValidatorFn[]): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    for (const v of validators) {
      pushValidator(target.constructor, String(propertyKey), v);
    }
  };
}

/** Anexa AsyncValidatorFn (sem DI) */
export function WithAsync(...validators: AsyncValidatorFn[]): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    for (const v of validators) {
      pushAsyncValidator(target.constructor, String(propertyKey), v);
    }
  };
}

/** Define opções do controle (updateOn, nonNullable, defaultValue) */
export function ControlOptions(options: {
  updateOn?: UpdateOn;
  nonNullable?: boolean;
  defaultValue?: any;
}): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    const pm = ensurePropMeta(target.constructor, String(propertyKey));
    if (options.updateOn !== undefined) pm.updateOn = options.updateOn;
    if (options.nonNullable !== undefined) pm.nonNullable = options.nonNullable;
    if ('defaultValue' in options) pm.defaultValue = options.defaultValue;
  };
}

export function Default(value: any): PropertyDecorator {
  return ControlOptions({ defaultValue: value });
}

export function UpdateOn(updateOn: UpdateOn): PropertyDecorator {
  return ControlOptions({ updateOn });
}

export function NonNullable(): PropertyDecorator {
  return ControlOptions({ nonNullable: true });
}

/*** ------------------------
 *  Decorators de classe (cross-field)
 *  ------------------------ */

export function CrossValidator(...validators: ValidatorFn[]): ClassDecorator {
  return (target: Function) => {
    const cm = ensureClassMeta(target);
    cm.groupValidators.push(...validators);
  };
}

export function CrossAsyncValidator(...validators: AsyncValidatorFn[]): ClassDecorator {
  return (target: Function) => {
    const cm = ensureClassMeta(target);
    cm.groupAsyncValidators.push(...validators);
  };
}

/*** ------------------------
 *  Helpers e validadores utilitários
 *  ------------------------ */

/** Util: extrai apenas dígitos */
function digitsOnly(val: any): string {
  return (val ?? '').toString().replace(/\D+/g, '');
}

/** -------- CPF -------- */

function isValidCPF(value: string): boolean {
  const cpf = digitsOnly(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  const calcDV = (base: string, factorStart: number) => {
    let sum = 0;
    for (let i = 0; i < base.length; i++) {
      sum += parseInt(base[i], 10) * (factorStart - i);
    }
    const resto = (sum * 10) % 11;
    return resto === 10 ? 0 : resto;
  };

  const d1 = calcDV(cpf.slice(0, 9), 10);
  const d2 = calcDV(cpf.slice(0, 10), 11);
  return d1 === parseInt(cpf[9], 10) && d2 === parseInt(cpf[10], 10);
}

export function cpfValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const v = control.value;
    if (v === null || v === undefined || String(v).trim() === '') return null; // delega required
    return isValidCPF(v) ? null : { cpfInvalid: true };
  };
}

export function CPF(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), cpfValidator());
  };
}

/** -------- CNPJ -------- */

function isValidCNPJ(value: string): boolean {
  const cnpj = digitsOnly(value);
  if (cnpj.length !== 14) return false;
  if (/^(\d)\1{13}$/.test(cnpj)) return false;

  const calcDV = (base: string, weights: number[]) => {
    let sum = 0;
    for (let i = 0; i < weights.length; i++) {
      sum += parseInt(base[i], 10) * weights[i];
    }
    const resto = sum % 11;
    return resto < 2 ? 0 : 11 - resto;
  };

  const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

  const d1 = calcDV(cnpj.slice(0, 12), w1);
  const d2 = calcDV(cnpj.slice(0, 13), w2);

  return d1 === parseInt(cnpj[12], 10) && d2 === parseInt(cnpj[13], 10);
}

export function cnpjValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const v = control.value;
    if (v === null || v === undefined || String(v).trim() === '') return null;
    return isValidCNPJ(v) ? null : { cnpjInvalid: true };
  };
}

export function CNPJ(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), cnpjValidator());
  };
}

/** -------- CEP --------
 * Aceita 8 dígitos ou formato 00000-000
 */
function isValidCEP(value: string): boolean {
  const str = String(value ?? '');
  return /^\d{8}$/.test(digitsOnly(str)) || /^\d{5}-\d{3}$/.test(str);
}

export function cepValidator(): ValidatorFn {
  return (control: AbstractControl) => {
    const v = control.value;
    if (v === null || v === undefined || String(v).trim() === '') return null;
    return isValidCEP(v) ? null : { cepInvalid: true };
  };
}

export function CEP(): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), cepValidator());
  };
}

/** -------- Telefone BR --------
 * Opções:
 * - tipo: 'qualquer' | 'celular' | 'fixo'
 * - allowMask: aceita parênteses, espaços e hífens na entrada
 *
 * Regras:
 * - Celular: 11 dígitos, 3º dígito (após DDD) = 9
 * - Fixo:    10 dígitos, 3º dígito tipicamente 2–5 (simplificação)
 */
export interface TelefoneBROptions {
  tipo?: 'qualquer' | 'celular' | 'fixo';
  allowMask?: boolean; // apenas informativo
}

function isValidTelefoneBR(value: string, opts: TelefoneBROptions = {}): boolean {
  const { tipo = 'qualquer' } = opts;
  const d = digitsOnly(value);

  if (tipo === 'celular') {
    return d.length === 11 && d[2] === '9';
  }
  if (tipo === 'fixo') {
    return d.length === 10 && /[2-5]/.test(d[2] ?? '');
  }
  // qualquer
  return (d.length === 11 && d[2] === '9') || (d.length === 10 && /[2-5]/.test(d[2] ?? ''));
}

export function telefoneBRValidator(opts: TelefoneBROptions = {}): ValidatorFn {
  return (control: AbstractControl) => {
    const v = control.value;
    if (v === null || v === undefined || String(v).trim() === '') return null;
    return isValidTelefoneBR(v, opts)
      ? null
      : { telefoneInvalid: { tipo: opts.tipo ?? 'qualquer' } };
  };
}

export function TelefoneBR(opts: TelefoneBROptions = {}): PropertyDecorator {
  return (target: any, propertyKey: string | symbol) => {
    pushValidator(target.constructor, String(propertyKey), telefoneBRValidator(opts));
  };
}

/*** ------------------------
 *  Helpers de grupo
 *  ------------------------ */

/**
 * Cria um ValidatorFn para comparação de campos.
 * Ex.: matchFields('password', 'confirmPassword')
 */
export function matchFields(field: string, confirmField: string, errorKey = 'match'): ValidatorFn {
  return (group: AbstractControl) => {
    const fg = group as FormGroup;
    const a = fg.get(field)?.value;
    const b = fg.get(confirmField)?.value;
    return a === b ? null : { [errorKey]: { field, confirmField } };
  };
}

/** Pelo menos um de uma lista de campos deve estar preenchido */
export function atLeastOneFilled(fields: string[], errorKey = 'atLeastOne'): ValidatorFn {
  return (group: AbstractControl) => {
    const fg = group as FormGroup;
    const hasOne = fields.some((f) => {
      const v = fg.get(f)?.value;
      return v !== null && v !== undefined && String(v).trim() !== '';
    });
    return hasOne ? null : { [errorKey]: { fields } };
  };
}

/** Retorna os metadados para inspeção/debug */
export function getFormModelMeta(ctor: Function): Readonly<ClassMeta> | undefined {
  return META.get(ctor);
}

/**
 * Constrói um FormGroup a partir de uma classe anotada com os decorators acima.
 *
 * @param ctor Constructor da classe (ex.: UserCreateModel)
 * @param initial Valores iniciais (sobrepõem defaults definidos por @Default)
 */
export function buildFormGroupFromClass<T>(ctor: new () => T, initial?: Partial<T>): FormGroup {
  const meta = META.get(ctor);
  if (!meta) {
    throw new Error(`[form.validators.ts] None Decorated property found for ${ctor.name}.`);
  }

  const controls: Record<string, FormControl> = {};

  for (const [prop, pm] of meta.props.entries()) {
    const valueFromInitial =
      initial && (initial as any)[prop] !== undefined ? (initial as any)[prop] : undefined;
    const value = valueFromInitial !== undefined ? valueFromInitial : (pm.defaultValue ?? null);

    const opts: any = {};
    if (pm.validators.length) opts.validators = pm.validators;
    if (pm.asyncValidators.length) opts.asyncValidators = pm.asyncValidators;
    if (pm.updateOn) opts.updateOn = pm.updateOn;
    if (pm.nonNullable !== undefined) opts.nonNullable = pm.nonNullable;

    controls[prop] = new FormControl(value, opts);
  }

  const groupOpts: any = {};
  if (meta.groupValidators.length) groupOpts.validators = meta.groupValidators;
  if (meta.groupAsyncValidators.length) groupOpts.asyncValidators = meta.groupAsyncValidators;

  return new FormGroup(controls, groupOpts);
}

/**
 * Executa validações (sync) de um objeto plano com base nos metadados,
 * sem criar FormGroup. Útil para validar DTO antes de enviar.
 */
export function validatePlainObject<T>(
  ctor: new () => T,
  obj: Partial<T>,
): Record<string, any> | null {
  const meta = META.get(ctor);
  if (!meta) return null;

  const errors: Record<string, any> = {};
  for (const [prop, pm] of meta.props.entries()) {
    const value = (obj as any)[prop];
    for (const v of pm.validators) {
      const err = v({ value } as AbstractControl);
      if (err) {
        errors[prop] = { ...(errors[prop] || {}), ...err };
      }
    }
  }
  return Object.keys(errors).length ? errors : null;
}

/*** ------------------------
 *  Mapper de mensagens de erro
 *  ------------------------ */

export type ErrorMessageFn = (error: any, ctx: { label?: string; controlName?: string }) => string;
export type ErrorMessages = Record<string, string | ErrorMessageFn>;

/** Mensagens padrão (pt-BR) para chaves de erro comuns */
export const DEFAULT_ERROR_MESSAGES: ErrorMessages = {
  required: (_e, ctx) => `${ctx.label ?? 'Campo'} required.`,
  requiredTrue: () => `It is required to mark this field.`,
  minlength: (e, ctx) =>
    `${ctx.label ?? 'Campo'} needs to be having at least ${e.requiredLength} characters (actual: ${e.actualLength}).`,
  maxlength: (e, ctx) =>
    `${ctx.label ?? 'Campo'} needs to be having at most ${e.requiredLength} characters (actual: ${e.actualLength}).`,
  email: () => `E-mail inválido.`,
  pattern: () => `Formato inválido.`,
  min: (e, ctx) => `${ctx.label ?? 'Valor'} mínimo é ${e.min}.`,
  max: (e, ctx) => `${ctx.label ?? 'Valor'} máximo é ${e.max}.`,
  cpfInvalid: () => `CPF inválido.`,
  cnpjInvalid: () => `CNPJ inválido.`,
  cepInvalid: () => `CEP inválido.`,
  telefoneInvalid: (e) => `Telefone inválido${e?.tipo ? ` (${e.tipo})` : ''}.`,
  match: () => `Os campos não coincidem.`,
  passwordsMismatch: () => `As senhas não coincidem.`,
  atLeastOne: () => `Preencha pelo menos um dos campos.`,
};

/** Retorna a primeira mensagem de erro de um controle */
export function getErrorMessage(
  control: AbstractControl | null,
  controlName?: string,
  messages: ErrorMessages = DEFAULT_ERROR_MESSAGES,
  label?: string,
): string | null {
  if (!control || !control.errors) return null;
  for (const [key, payload] of Object.entries(control.errors)) {
    const def = messages[key];
    if (!def) continue;
    return typeof def === 'function' ? def(payload, { label, controlName }) : def;
  }
  return null;
}

/** Mapeia todas as mensagens de erro do FormGroup (por controle e grupo) */
export function mapFormErrors(
  fg: FormGroup,
  messages: ErrorMessages = DEFAULT_ERROR_MESSAGES,
  labels: Record<string, string> = {},
): Record<string, string[]> {
  const out: Record<string, string[]> = {};

  // erros por controle
  Object.keys(fg.controls).forEach((name) => {
    const c = fg.get(name);
    if (c && c.invalid && c.errors) {
      const arr: string[] = [];
      for (const [key, payload] of Object.entries(c.errors)) {
        const def = messages[key];
        if (!def) continue;
        arr.push(
          typeof def === 'function'
            ? def(payload, { label: labels[name], controlName: name })
            : def,
        );
      }
      if (arr.length) out[name] = arr;
    }
  });

  // erros a nível de grupo
  if (fg.errors) {
    const arr: string[] = [];
    for (const [key, payload] of Object.entries(fg.errors)) {
      const def = messages[key];
      if (!def) continue;
      arr.push(
        typeof def === 'function'
          ? def(payload, { label: labels['$group'], controlName: '$group' })
          : def,
      );
    }
    if (arr.length) out['$group'] = arr;
  }

  return out;
}

/*** ------------------------
 *  Exemplos de uso (comentados)
 *  ------------------------ */

/*
// user-create.model.ts
import {
  Email, MinLength, Required, Pattern, Default,
  CrossValidator, matchFields, buildFormGroupFromClass,
  CPF, CNPJ, CEP, TelefoneBR,
  mapFormErrors, getErrorMessage, DEFAULT_ERROR_MESSAGES
} from './validators';

@CrossValidator(
  matchFields('password', 'confirmPassword', 'passwordsMismatch')
)
export class UserCreateModel {
  @Required()
  @MinLength(3)
  @Default('')
  name!: string;

  @Required()
  @Email()
  @Default('')
  email!: string;

  @Required()
  @MinLength(8)
  @Pattern(/^(?=.*[A-Za-z])(?=.*\d).+$/)
  @Default('')
  password!: string;

  @Required()
  @Default('')
  confirmPassword!: string;

  @CPF()
  @Default('')
  cpf!: string;

  @CNPJ()
  @Default('')
  cnpj!: string;

  @CEP()
  @Default('')
  cep!: string;

  @TelefoneBR({ tipo: 'celular' })
  @Default('')
  celular!: string;
}

// user-create.component.ts (exibição das mensagens)
import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { buildFormGroupFromClass, mapFormErrors, getErrorMessage } from './validators';
import { UserCreateModel } from './user-create.model';

@Component({
  selector: 'app-user-create',
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">
      <input formControlName="name" placeholder="Nome" />
      <div class="error" *ngIf="error('name') as msg">{{ msg }}</div>

      <input formControlName="email" placeholder="E-mail" />
      <div class="error" *ngIf="error('email') as msg">{{ msg }}</div>

      <input type="password" formControlName="password" placeholder="Senha" />
      <div class="error" *ngIf="error('password') as msg">{{ msg }}</div>

      <input type="password" formControlName="confirmPassword" placeholder="Confirmar senha" />
      <div class="error" *ngIf="error('confirmPassword') as msg">{{ msg }}</div>

      <input formControlName="cpf" placeholder="CPF" />
      <div class="error" *ngIf="error('cpf') as msg">{{ msg }}</div>

      <button type="submit">Salvar</button>

      <div class="error" *ngIf="form.errors && form.touched">
        <span *ngFor="let m of groupErrors">{{ m }}</span>
      </div>
    </form>
  `
})
export class UserCreateComponent {
  form: FormGroup = buildFormGroupFromClass(UserCreateModel);
  labels = { name: 'Nome', email: 'E-mail', password: 'Senha', confirmPassword: 'Confirmar Senha', cpf: 'CPF' };

  get groupErrors(): string[] {
    return mapFormErrors(this.form, undefined, this.labels)['$group'] ?? [];
  }

  error(controlName: string): string | null {
    const c = this.form.get(controlName);
    return getErrorMessage(c, controlName, undefined, this.labels[controlName]);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const dto = this.form.getRawValue();
    // ... chamar serviço
  }
}

********** Exemplo de uso component *******************************************

// Exibir a primeira mensagem de erro do controle
error(controlName: string): string | null {
  const c = this.form.get(controlName);
  // const labels = { name: 'Nome', email: 'E-mail', password: 'Senha' };
//   return getErrorMessage(c, controlName, undefined, labels[controlName]);
// }

// Listar mensagens de erro de grupo (ex.: matchFields)
// get groupErrors(): string[] {
//   return mapFormErrors(this.form)['$group'] ?? [];
// }


*/
