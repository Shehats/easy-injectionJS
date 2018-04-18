import { IContainer,
         Stereotype,
         Dependency } from '../core';
import { ClassContainer } from './ClassContainer';

export class Container {
  private _dependencies: Dependency[];
  private _name: string;
  private _stereotype: Stereotype;
  private _type: (new(...args:any[]) => {});
  private _instance: Object;
  private _resolved: Dependency[];

  constructor (stereotype?: Stereotype,
               type?: (new(...args:any[]) => {}),
               dependencies?: Dependency[],
               name?: string) {
    this._dependencies = dependencies || [];
    this._name = (name)? name: type.name;
    this._stereotype = stereotype;
    this._type = type;
    this._resolved = [];
  }

  public get dependencies(): Dependency[] {
    return this._dependencies;
  }

  public get name(): string {
    return this._name;
  }

  public get stereotype(): Stereotype {
    return this._stereotype;
  }

  public get type(): (new(...args:any[]) => {}) {
    return this._type;
  }

  public get instance() : Object {
    return this._instance;
  }

  public set dependencies(v : Dependency[]) {
    this._dependencies = v;
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

  public addDependency(v: Dependency): void {
    this._dependencies.push(v);
  }

  public resolveDepedendencies (): Object {
    function _resolveInstances (name: string): Object {
      let data = ClassContainer.getDependency(name)
      return (data.stereotype == Stereotype.Singleton)
      ? data.instance
      : data.resolveDepedendencies();
    }
    function _resolveHelper (dependencies: Dependency[], 
                             instance: Object,
                             resolved: Object[]): Object {
      if (dependencies.length == 0)
        return instance;
      let _current: Dependency = dependencies.pop();
      instance[_current.ref] =  _resolveInstances (_current.container.name)
      _current.resolved = instance[_current.ref]
      resolved.push(_current)
      return _resolveHelper(dependencies, instance, resolved);
    }

    if (this.resolved.length != 0 && this._stereotype != Stereotype.Singleton) {
      let arr = this.resolved;
      this._instance = new class extends this.type {
        constructor (...args: any[]) {
          super();
          arr.forEach(x => {
            this[x.ref] = x.resolved;
          });
        }
      }()
    }
    else {
      this._instance = _resolveHelper(this.dependencies, new class extends this.type {}(), this._resolved);
      ClassContainer.insertDependency(this.name, this);
    }
    return this._instance;
  }
}
