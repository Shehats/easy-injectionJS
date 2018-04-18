import { IContainer } from '../core';
import { Container } from './container';

export class ClassContainer {
  private static _instance: ClassContainer;
  private static _container: IContainer; 

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
    return this.ContainerInstance[target] || this.ContainerInstance[target]
  }

  public static getDepedencies(): IContainer{
    return this._container;
  }
}
