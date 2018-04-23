import { IContainer, Dependency } from './';

export class Wrapper {
  private static _instance: Wrapper;
  private static _container: IContainer; 
  private static _parents: IContainer;

  private constructor () {
  }

  public static get Instance (): Wrapper {
    return this._instance || (this._instance = new this());
  }

  public static get ContainerInstance (): IContainer {
    return this._container || (this._container = new class implements IContainer {}());
  }

  public static insertDependency (target: string, data: Dependency): void {
   this.ContainerInstance[target].push(data);
  }

  public static insertDepedencies (target: string, data: Dependency[]): void {
   this.ContainerInstance[target] = data; 
  }

  public static getDepedencies (target: string): Dependency[] {
    return this.ContainerInstance[target] || (this.ContainerInstance[target] = []);
  }
}
