import "reflect-metadata";

import { isPrimitive, 
         Paremeter, 
         Dependency, 
         stereotypes, 
         Wrapper, 
         Stereotype,
         resolveDependencyTree} from './';

import { Container, 
         ClassContainer, 
         FactoryContainer,
         GenericContainer,
         StaticContainer } from '../containers';

export const EasySingleton = <T extends {new(...args:any[]):{}}>(name?: string) => function(target: T): any {
  let _existing: Dependency[] = Wrapper.getDepedencies (target.name);
  let _container: Container = new GenericContainer(Stereotype.Singleton, target, _existing, (name) ? name: target.name);
  resolveDependencyTree(target, _container, _existing);
  let instance = _container.resolveDepedendencies();
  return class extends target {
    constructor (...args: any[]) {
      super();
      _container.resolved.forEach(x => {
        this[x.ref] = x.resolved;
      })
    }
  }
}

export const EasyPrototype = <T extends {new(...args:any[]):{}}>(name?: string) => function(target: T): any {
  let _existing: Dependency[] = Wrapper.getDepedencies (target.name);
  let _container: Container = new GenericContainer(Stereotype.Prototype, target, _existing, (name) ? name: target.name);
  resolveDependencyTree(target, _container, _existing);
  let instance = _container.resolveDepedendencies();
  return class extends target {
    constructor (...args: any[]) {
      super();
      _container.resolved.forEach(x => {
        this[x.ref] = x.resolved;
      })
    }
  }
}

export const EasyFactory = (name?: string) => function(target: Function): any{
  let _existing: Dependency[] = Wrapper.getDepedencies (target.name);
  let _factory: Container = new FactoryContainer(Stereotype.Factory, target,  _existing, (name) ? name: target.name);
  _factory.resolveDepedendencies();
}

export const Easy = (name?: string) => function(target: Object, 
  propertyKey: string) {
  let _existing: Dependency[] = Wrapper.getDepedencies(target.constructor.name);
  let _type = Reflect.getMetadata("design:type", target, propertyKey)
  _existing.push(new Dependency(propertyKey, ClassContainer.getDependency(name || _type.name)));
  Wrapper.insertDepedencies(target.constructor.name, _existing);
}

export const is = <T>(target: (new(...args:any[]) => T) | string): T => {
  let _container: Container = ClassContainer.getDependency((isPrimitive(target))? target: target['name'])
  if (_container)
    return <T>_container.resolveDepedendencies();
}

export const Easily = (name: string, target: any) => {
  let _static = new StaticContainer(Stereotype.Easily, [], name, target);
  _static.resolveDepedendencies();
}
