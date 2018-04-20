import "reflect-metadata";

import { Container, ClassContainer } from '../containers';
import { Wrapper, Dependency, stereotypes, isPrimitive } from '../core';

const wrapper: Wrapper = Wrapper.Instance;

export const getDependencies = <T extends {new(...args:any[]):{}}>(target: T | Function, 
  name?: string): Dependency[] => {
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
  return _existing;
}

export const resolveDependencyTree = <T extends {new(...args:any[]):{}}>(target: T, 
  container: Container, dependencies: Dependency[]): void => {
  let lis = ClassContainer.getParents()
  let _obj = new target();
  // Checking children dependencies:
  Object.getOwnPropertyNames(lis).forEach(x => {
    lis[x].resolveDepedendencies();
    if(_obj instanceof lis[x].type) {
      container.resolved = lis[x].resolved;
      lis[x].addChild(container);
    } 
    if (dependencies) {
      dependencies.forEach(y => {
        if (lis[x].instance && y.container.type == lis[x].type) {
          y.container = lis[x].instance;
        }
      });
    }
  })
  container.dependencies = dependencies;
}
