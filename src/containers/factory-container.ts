import { Container, ClassContainer } from './';
import { Dependency, Stereotype } from '../core';

export class FactoryContainer extends Container {
  private _children: Container[];
  private _type: Function;

  constructor (stereotype?: Stereotype,
               type?: Function,
               dependencies?: Dependency[],
               name?: string) {
    super(stereotype, dependencies, name);
    this._type = type;
    this._children = [];
  }

  public get type(): Function {
    return this._type;
  }

  public addChild(child: Container): void {
    this._children.push(child);
  }
  public resolveDepedendencies (): Object {
    function _resolveInstances (name: string): Object {
      let data = ClassContainer.getDependency(name)
      return (data.stereotype == Stereotype.Singleton)
      ? data.instance
      : data.resolveDepedendencies();
    }
    function _resolveHelper (dependencies: Dependency[],
                             resolved: Object[]): Object {
      if (dependencies.length == 0)
        return;
      let _current: Dependency = dependencies.pop();
      _current.resolved = _resolveInstances (_current.container.name)
      resolved.push(_current)
      return _resolveHelper(dependencies, resolved);
    }
    _resolveHelper(this.dependencies, this._resolved);
    this._instance = (this._children.length != 0)
    ? this._children[this._children.length - 1]
    : this._type;
    ClassContainer.insertDependency(this.name, this);
    ClassContainer.insertParent(this.name, this);
    return this._instance;
  }

  public get instance(): Object {
    return this._instance || (this._instance = this._children[this._children.length - 1]);
  }
}
