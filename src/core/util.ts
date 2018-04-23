import "reflect-metadata";

import { Container, ClassContainer } from '../containers';
import { Dependency, stereotypes, isPrimitive } from '../core';

export const resolveDependencyTree = <T extends {new(...args:any[]):{}}>(target: T, 
  container: Container, dependencies: Dependency[]): void => {
  let lis = ClassContainer.getParents();
  // Checking children dependencies:
  if (lis) {
    let _obj = new target();
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
    container.dependencies = dependencies || [];
  }
}
