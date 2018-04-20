import { IContainer,
         Stereotype,
         Dependency } from '../core';

export abstract class Container {
  protected _dependencies: Dependency[];
  protected _name: string;
  protected _stereotype: Stereotype;
  protected _instance: Object;
  protected _resolved: Dependency[];

  constructor (stereotype?: Stereotype,
               dependencies?: Dependency[],
               name?: string) {
    this._dependencies = dependencies || [];
    this._name = name;
    this._stereotype = stereotype;
    this._resolved = [];
  }

  public get stereotype(): Stereotype {
    return this._stereotype;
  }

  public set stereotype(v: Stereotype) {
    this._stereotype = v;
  }

  public abstract get type(): Object;

  public get instance(): Object {
    return this._instance;
  }

  public get dependencies(): Dependency[] {
    return this._dependencies;
  }
  public set dependencies(v : Dependency[]) {
    this._dependencies = v;
  }
  public get name(): string {
    return this._name;
  }
  public set name(v: string) {
    this._name = v;
  }

  public set instance(v: Object) {
    this._instance = v;
  }

  public get resolved(): Dependency[] {
    return this._resolved;
  }

  public set resolved(v: Dependency[]) {
    this._resolved = v;
  }

  public addDependency(v: Dependency): void {
    this._dependencies.push(v);
  }

  public abstract resolveDepedendencies(): Object;
}
