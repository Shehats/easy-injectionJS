import { Container, ClassContainer } from './';
import { Stereotype, Dependency } from '../core';

export class StaticContainer extends Container{
  private _type: any;
  constructor (stereotype?: Stereotype,
               dependencies?: Dependency[],
               name?: string,
               type?: any) {
    super(stereotype, dependencies, name);
    this._type = type;
    this._instance = type;
  }
  public get type(): any {
    return this._type;
  }
  public resolveDepedendencies(): any {
    ClassContainer.insertDependency(this.name, this);
    return this._type;
  }
}
