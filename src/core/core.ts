import { Container } from '../containers';

export const stereotypes={
  param: Symbol('EasyParam'),
  singleton: Symbol('EasySingleton'),
  prototype: Symbol('EasyPrototype'),
  easy: Symbol('Easy'),
  factory: Symbol('EasyFactory'),
  observable: Symbol('EasyObservable'),
  Inject: Symbol('Inject'),
  Service: Symbol('Service')
}

export const isPrimitive = (type: any): boolean => (typeof type === "string" 
  || typeof type === "number" || typeof type === "boolean");

export class Paremeter {
    private _id: number;
    private _name: string;
    private _type: any;
    private _resolved: Object;
    constructor(id: number, name: string, type: any) {
      this._id = id;
      this._name = name;
      this._type = type;
    }

    public get name(): string {
      return this._name;
    }

    public get id(): number {
      return this._id;
    }

    public get type() : any {
      return this._type;
    }

    public get resolved(): Object {
      return this.resolved;
    }

    public set resolved(v: Object) {
      this._resolved = v;
    }
}

export class Dependency {
  private _ref: string;
  private _container: Container;
  private _resolved: Object;

  constructor(ref: string, container: Container) {
    this._ref = ref;
    this._container = container;
  }

  public get ref() : string {
    return this._ref;
  }
  
  public get container(): Container {
    return this._container;
  }

  public set container(v : Container) {
    this._container = v;
  }

  public get resolved(): Object {
    return this._resolved;
  }

  public set resolved(v: Object) {
    this._resolved = v;
  }
}

export interface IContainer {
}

export enum Stereotype {
  Singleton,
  Prototype,
  Observable,
  Factory,
  Easily 
}

