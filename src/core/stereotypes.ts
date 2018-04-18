import "reflect-metadata";
import { isPrimitive, Paremeter, Dependency, stereotypes, Wrapper, Stereotype } from './';
import { Container, ClassContainer } from '../containers';

const wrapper: Wrapper = Wrapper.Instance;

export const EasySingleton = <T extends {new(...args:any[]):{}}>(name?: string) => function(target: T): any {
  let _ref = wrapper.get(name || target.name);
  if (!_ref) {
    // try by target name
    _ref = wrapper.get(target.name);
    if (!_ref) {
      wrapper.insert(name || target.name, target);
    _ref = wrapper.get(name || target.name);
    }
  }
  let _existing: Dependency[] = Reflect.getMetadata(stereotypes.easy, _ref);
  let _container: Container = new Container(Stereotype.Singleton, target, _existing, (name) ? name: target.name);
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
  let _ref = wrapper.get(name || target.name);
  if (!_ref) {
    // try by target name
    _ref = wrapper.get(target.name);
    if (!_ref) {
      wrapper.insert(name || target.name, target);
    _ref = wrapper.get(name || target.name);
    }
  }
  let _existing: Dependency[] = Reflect.getMetadata(stereotypes.easy, _ref);
  let _container: Container = new Container(Stereotype.Prototype, target, _existing, (name) ? name: target.name);
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

export const Easy = (name?: string) => function(target: Object, 
  propertyKey: string){
  let _ref = wrapper.get(target.constructor.name);
  if (!_ref) {
    wrapper.insert(target.constructor.name, target);
    _ref = wrapper.get(target.constructor.name)
  }
  let _existing: Dependency[] = Reflect.getMetadata(stereotypes.easy, _ref, propertyKey) || [];
  let _type = Reflect.getMetadata("design:type", target, propertyKey)
  console.log(_type)
  _existing.push(new Dependency(propertyKey, ClassContainer.getDependency(name || _type.name)));
  Reflect.defineMetadata(stereotypes.easy, _existing, _ref);
}

export const EasyFactory = (name?: string) => function(target: Object) {
}

