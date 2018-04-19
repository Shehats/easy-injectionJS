import "reflect-metadata";

import { isPrimitive, 
         Paremeter, 
         Dependency, 
         stereotypes, 
         Wrapper, 
         Stereotype,
         getDependencies,
         resolveDependencyTree } from './';
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
  propertyKey: string){
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



@EasyFactory()
abstract class Person {
  abstract getName();
  abstract setName(v: string);
}

@EasySingleton()
class Somebody extends Person{
  // @Easy()
  constructor (private name: string) {
    super()
    this.name = 'David';
  }

  public getName() {
    return this.name;
  }
  public setName(v: string) {
    this.name = v;
  }
}

@EasyPrototype()
class Nobody extends Person{
  name: string = 'a71'
  greeting: string;
  @Easy()
  somebody: Person;
  private key: string;
  friend: Nobody;
  constructor () {
    super()
  }
  
  public getName() {
    return this.somebody.getName();
  }

  public setName(v: string) {
    this.somebody.setName(v);
  }

  public greet(name: string) {
    return "Hello " + name + ", " + this.greeting;
  }
}

@EasySingleton()
class Data {
  @Easy()
  somebody: Person;

  change(v: string) {
    this.somebody.setName(v);
  }

  getName(): string {
    return this.somebody.getName();
  }
}
let d = new Data()
console.log(d.getName())
d.change('sal')
console.log(d.getName())
// console.log((new Nobody()).getName()())