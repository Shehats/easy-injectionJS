export { isPrimitive,
         Paremeter, 
         stereotypes,
         IContainer,
         Stereotype,
         Dependency,
         Wrapper } from './core';

export { EasySingleton,
         EasyPrototype,
         Easy,
         EasyFactory,
         is } from './stereotypes';

export { getDependencies,
		   resolveDependencyTree } from './util';