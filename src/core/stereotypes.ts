import "reflect-metadata";

import { isPrimitive, 
         Paremeter, 
         Dependency, 
         stereotypes, 
         Wrapper, 
         Stereotype,
         getDependencies,
         resolveDependencyTree} from './';

import { Container, 
         ClassContainer, 
         FactoryContainer,
         GenericContainer } from '../containers';

const wrapper: Wrapper = Wrapper.Instance;

export const EasySingleton = <T extends {new(...args:any[]):{}}>(name?: string) => function(target: T): any {
  let _existing: Dependency[] = getDependencies(target, name);
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
  let _existing: Dependency[] = getDependencies(target, name);
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
  let _existing: Dependency[] = getDependencies(target, name);  
  let _factory: Container = new FactoryContainer(Stereotype.Factory, target,  _existing, (name) ? name: target.name);
  _factory.resolveDepedendencies();
}

export const Easy = (name?: string) => function(target: Object, 
  propertyKey: string) {
  let _ref = wrapper.get(target.constructor.name);
  if (!_ref) {
    wrapper.insert(target.constructor.name, target);
    _ref = wrapper.get(target.constructor.name)
  }
  let _existing: Dependency[] = Reflect.getMetadata(stereotypes.easy, _ref, propertyKey) || [];
  let _type = Reflect.getMetadata("design:type", target, propertyKey)
  _existing.push(new Dependency(propertyKey, ClassContainer.getDependency(name || _type.name)));
  Reflect.defineMetadata(stereotypes.easy, _existing, _ref);
}
