import { IContainer } from '../core';
import { Container } from './container';

export class ClassContainer {
  private static _instance: ClassContainer;
  private static _container: IContainer; 
  private static _parents: IContainer;

  private constructor () {
  }

  public static get Instance (): ClassContainer {
    return this._instance || (this._instance = new this());
  }

  public static get ContainerInstance (): IContainer {
    return this._container || (this._container = new class implements IContainer {}());
  }

  public static insertDependency (target: string, data: Container): void {
   this.ContainerInstance[target] = data;
  }

  public static getDependency (target: string): Container {
    return this.ContainerInstance[target];
  }

  public static getDepedencies(): IContainer{
    return this._container;
  }

  public static get ParentsInstance (): IContainer {
    return this._parents || (this._parents = new class implements IContainer {}());
  }

  public static insertParent (target: string, data: Container): void {
   this.ParentsInstance[target] = data;
  }

  public static getParent (target: string): Container {
    return this.ParentsInstance[target];
  }

  public static getParents(): IContainer{
    return this._parents;
  }
}
