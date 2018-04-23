import { Container, ClassContainer } from './';
import { Stereotype, Dependency } from '../core';

export class StaticContainer extends Container{
  private _type: Object;
  constructor (stereotype?: Stereotype,
               dependencies?: Dependency[],
               name?: string,
               type?: Object) {
    super(stereotype, dependencies, name);
    this._type = type;
    this._instance = type;
  }
  public get type(): Object {
    return this._type;
  }
  public resolveDepedendencies(): Object {
    ClassContainer.insertDependency(this.name, this);
    return this._type;
  }
}
