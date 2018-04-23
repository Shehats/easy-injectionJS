import { IContainer,
         Stereotype,
         Dependency } from '../core';

import { ClassContainer, Container } from './';

export class GenericContainer extends Container {
  private _type: (new(...args:any[]) => {});
  
  constructor (stereotype?: Stereotype,
               type?: (new(...args:any[]) => {}),
               dependencies?: Dependency[],
               name?: string) {
    super(stereotype, dependencies, name);
    this._type = type;
  }

  public get type(): (new(...args:any[]) => {}) {
    return this._type;
  }

  public resolveDepedendencies (): Object {
    function _resolveInstances (name: string): Object {
      let data = ClassContainer.getDependency(name)
      return (data.stereotype == Stereotype.Singleton || data.stereotype == Stereotype.Easily)
      ? data.instance
      : data.resolveDepedendencies();
    }
    function _resolveHelper (dependencies: Dependency[], 
                             instance: Object,
                             resolved: Object[]): Object {
      if (!dependencies || dependencies.length == 0)
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
