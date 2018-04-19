import "reflect-metadata";
import { isPrimitive, 
         Paremeter, 
         Dependency, 
         stereotypes, 
         Wrapper, 
         Stereotype } from './';
import { Container, 
         ClassContainer, 
         FactoryContainer,
         GenericContainer } from '../containers';

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
  let _container: Container = new GenericContainer(Stereotype.Singleton, target, _existing, (name) ? name: target.name);
  let lis = ClassContainer.getParents()
  let _obj = new target();
  Object.getOwnPropertyNames(lis).forEach(x => {
    if(_obj instanceof lis[x].type) {
      _container.resolved = lis[x].resolved;
      lis[x].addChild(_container);
    } else {
      _existing.forEach(y => {
        if (lis[x].instance) {
          y.container = lis[x].instance;
        }
      });
    }
  })
  _container.dependencies = _existing
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
  let _container: Container = new GenericContainer(Stereotype.Prototype, target, _existing, (name) ? name: target.name);
  let lis = ClassContainer.getParents()
  let _obj = new target();
  // Checking children dependencies:
  Object.getOwnPropertyNames(lis).forEach(x => {
    if(_obj instanceof lis[x].type) {
      _container.resolved = lis[x].resolved;
      lis[x].addChild(_container);
    } else {
      _existing.forEach(y => {
        if (lis[x].instance) {
          y.container = lis[x].instance;
        }
      });
    }
  })
  _container.dependencies = _existing
  // If using superclass to reference subclass.
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
  console.log(_existing)
  Reflect.defineMetadata(stereotypes.easy, _existing, _ref);
}



@EasyFactory()
abstract class Person {
  abstract getName();
  abstract setName(v: string);
}

@EasySingleton('somebody')
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
  @Easy('somebody')
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