# easy-injectionJS

A package that provides dependency injection using common design patterns as stereotypes. It easily injects depedencies in runtime and supports inheritance:

There's no additional dependencies or containers needed to use the package. You can simply use it as follows:

npm i -S easy-injectionjs

Or

yarn add easy-injectionjs

Dependencies without inheritance:

```javascript
import { Easy, EasyPrototype, EasySingleton } from 'easy-injectionjs';

// Creates a singleton instance of Movie class in runtime
@EasySingleton()
class Movie {
  constructor (private name: string, private ratings: number) {
    // Lets say that they just release the movie :D
    this.name = 'Black Panther';
    this.ratings = 9.0; // I really like that movie
  }

  public getName(): string {
    return this.name;
  }

  public getRatings(): number {
    return this.ratings;
  }

  public setName(v: string) {
    this.name = v;
  }

  public setRatings(v: number) {
    this.ratings = v;
  }
}

// Creates a multiple instances as needed in runtime
@EasyPrototype()
class Actor {
  @Easy()
  private movie: Movie;
  private name: string;

  constructor (name: string) {
    this.name = name;
  }

  public getMovieName(): string {
    return this.movie.getName();
  }

  public setMovieName(v: string) {
    this.movie.setName(v);
  }
}

let T_Challa = new Actor('Chadwick Boseman');
console.log(T_Challa.getMovieName());// Output is Black Panther
T_Challa.setMovieName('Black Panther II'); // Hopefully
console.log(T_Challa.getMovieName()); // Output is Black Panther II
let Erik_Killmonger = new Actor('Michael B Jordan');
console.log(Erik_Killmonger.getMovieName()) // // Output is Black Panther II
```
If the movie had the annotaion of EasyPrototype instead, Erik_Killmonger.getMovieName() will return Black Panther istead of Black Panther 2.

Interfaces and named dependencies example:

```javascript
import { Easy, EasyPrototype, EasySingleton } from 'easy-injectionjs';

interface Show {
  getName(): string;
  getRatings(): number;
  setName(v: string);
  setRatings(v: number);
}

// Creates a singleton instance of Movie class in runtime
@EasySingleton('Movie')
class Movie implements Show {
  constructor (private name: string, private ratings: number) {
    // Lets say that they just release the movie :D
    this.name = 'Black Panther';
    this.ratings = 9.0; // I really like that movie
  }

  public getName(): string {
    return this.name;
  }

  public getRatings(): number {
    return this.ratings;
  }

  public setName(v: string) {
    this.name = v;
  }

  public setRatings(v: number) {
    this.ratings = v;
  }
}

// Creates a multiple instances as needed in runtime
@EasyPrototype()
class Actor {
  @Easy('Movie')
  private movie: Show;
  private name: string;

  constructor (name: string) {
    this.name = name;
  }

  public getMovieName(): string {
    return this.movie.getName();
  }

  public setMovieName(v: string) {
    this.movie.setName(v);
  }
}

let T_Challa = new Actor('Chadwick Boseman');
console.log(T_Challa.getMovieName());// Output is Black Panther
T_Challa.setMovieName('Black Panther II'); // Hopefully
console.log(T_Challa.getMovieName()); // Output is Black Panther II
let Erik_Killmonger = new Actor('Michael B Jordan');
console.log(Erik_Killmonger.getMovieName()) // // Output is Black Panther II
```
The package support inheritance even with abstract classes using the @EasyFactory decorator:

Example:

```javascript
import { Easy, EasyFactory, EasyPrototype, EasySingleton } from 'easy-injectionjs';

@EasyFactory()
abstract class Show {
  public abstract getName(): string;
  public abstract getRatings(): number;
  public abstract setName(v: string);
  public abstract setRatings(v: number);
}

// Creates a singleton instance of Movie class in runtime
@EasySingleton()
class Movie extends Show {
  constructor (private name: string, private ratings: number) {
    super();
    // Lets say that they just release the movie :D
    this.name = 'Black Panther';
    this.ratings = 9.0; // I really like that movie
  }

  public getName(): string {
    return this.name;
  }

  public getRatings(): number {
    return this.ratings;
  }

  public setName(v: string) {
    this.name = v;
  }

  public setRatings(v: number) {
    this.ratings = v;
  }
}

// Creates a multiple instances as needed in runtime
@EasyPrototype()
class Actor {
  @Easy()
  private movie: Show;
  private name: string;

  constructor (name: string) {
    this.name = name;
  }

  public getMovieName(): string {
    return this.movie.getName();
  }

  public setMovieName(v: string) {
    this.movie.setName(v);
  }
}

let T_Challa = new Actor('Chadwick Boseman');
console.log(T_Challa.getMovieName());// Output is Black Panther
T_Challa.setMovieName('Black Panther II'); // Hopefully
console.log(T_Challa.getMovieName()); // Output is Black Panther II
let Erik_Killmonger = new Actor('Michael B Jordan');
console.log(Erik_Killmonger.getMovieName()) // // Output is Black Panther II
```
Both Iterfaces and abstract classes inheritance support naming to differentiate between the children dependencies and the names have to go into the @Easy decorator and have to match the names in the @EasyPrototype and @EasySingleton decorators.
You can even name the @EasyFactory decorator if u have many abstract classes extending each others.

You can even not name anything and let the package figure out which dependencies as needed:

```javascript
import { Easy, EasyFactory, EasyPrototype, EasySingleton } from 'easy-injectionjs';

@EasyFactory()
abstract class Person {
  abstract getName();
  abstract setName(v: string);
}

// @EasyObservable()
@EasySingleton()
class Somebody extends Person{
  // @Easy()
  constructor (private name: string) {
    super()
    this.name = 'Sal';
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
  @Easy()
  somebody: Person;
  constructor () {
    super()
  }
  
  public getName() {
    return this.somebody.getName();
  }

  public setName(v: string) {
    this.somebody.setName(v);
  }
}

@EasyPrototype()
class Data {
  @Easy()
  somebody: Person;
  name: string;

  change(v: string) {
    this.somebody.setName(v);
  }

  getName(): string {
    return this.somebody.getName();
  }
}

let n = new Nobody();
console.log(n.getName()) // Prints Sal
n.setName('awesome');
console.log(n.getName())  // Prints awesome
let d = new Data()
console.log(d.getName())  // Prints awesome
d.change('Gelba')
console.log(n.getName())  // Prints Gelba
d.change('kaa')
console.log(n.getName())  // Prints Kaa

```
## The "is" Keyword:

The "is" function is used to retrieve dependencies anywhere in the program. It can also be usint with constructor injection:

### Example:
```javascript
import { EasySingleton,
         EasyPrototype,
         is } import 'easy-injectionjs';

@EasySingleton()
class Somebody {
  // @Easy()
  constructor (private name: string) {
    this.name = 'Vladi';
  }

  public getName() {
    return this.name;
  }
  public setName(v: string) {
    this.name = v;
  }
}

@EasyPrototype()
class Awesome {
  private _name: string;
  constructor (someone: Somebody = is(Somebody)) {
    someone.setName('Sal')
    this._name = someone.getName();
    console.log(this._name);
  }
}

is(Awesome) // call returns an instance of Awesome

console.log(is(Somebody).getName()) // returns Sal since it is a singleton :D

```

## The "Easily" Method:

The "Easily" is ideally used to define static constants or simple objects like:

```javascript
import { Easily } from 'easy-injectionjs';

const config = {
  author: 'Sal'
}
Easily('config', config);
```

It requires a name to be injected. PS it can work for npm packages also, if imported like this: import * as smth from 'package'

```javascript
@EasyPrototype()
class Nobody {
  @Easy('config')
  config: Object;
  constructor () {
    super()
  }
  
  public getName() {
    return this.somebody.getName();
  }
 
  public setName(v: string) {
    this.somebody.setName(v);
  }
}
```

A bit complicated example:

```javascript
import {Easy, EasyPrototype, EasySingleton, EasyFactory, Easily, is} from 'easy-injectionjs';

Easily('config', {
  feeling: 'hungry'
})

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
    this.name = 'Sal';
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
  @Easy()
  somebody: Person;
  @Easy('config')
  config: Object;
  constructor () {
    super()
  }
  
  public getName() {
    return this.somebody.getName();
  }
 
  public setName(v: string) {
    this.somebody.setName(v);
  }
}

@EasyFactory()
abstract class Show {
  public abstract getName(): string;
  public abstract getRatings(): number;
  public abstract setName(v: string);
  public abstract setRatings(v: number);
}
 
// Creates a singleton instance of Movie class in runtime
@EasySingleton()
class Movie extends Show {
  constructor (private name: string, private ratings: number) {
    super();
    // Lets say that they just release the movie :D
    this.name = 'Black Panther';
    this.ratings = 9.0; // I really like that movie
  }
 
  public getName(): string {
    return this.name;
  }
 
  public getRatings(): number {
    return this.ratings;
  }
 
  public setName(v: string) {
    this.name = v;
  }
 
  public setRatings(v: number) {
    this.ratings = v;
  }
}
 
@EasySingleton()
class Data {
  @Easy()
  somebody: Person;
  name: string;
  @Easy()
  movie: Movie;
  change(v: string) {
    this.somebody.setName(v);
  }
 
  getName(): string {
    return this.somebody.getName();
  }
}
 
let n = new Nobody();
console.log(n)
console.log(n.getName()) // Prints Sal
n.setName('awesome');
console.log(n.getName())  // Prints awesome
let d = new Data()
console.log(d)
console.log(d.getName())  // Prints awesome
d.change('Gelba')
console.log(n.getName())  // Prints Gelba
d.change('kaa')
console.log(n.getName())
```
Even method injection is very easy using both "Easily", the decorators and "is". That makes dynamic injection very easy.

```javascript
import { Easily } from 'easy-injectionjs';

Easily('Data', {
  name: 'Sal'
});

```
And somewhere in the program in another file:

```javascript
import { is, Easily } from 'easy-injectionjs';

function modifyData(data: any = is('Data')) {
  data.name = 'I am Batman';
  // update it
  Easily('Data',data);
}
```

And maybe another class requires "Data":

```javascript
import { EasyPrototype, Easy } from 'easy-injectionjs';
// why not :D
@EasyPrototype()
class Mule {
  @Easy('Data')
  private data:any;
}
```
If modifyData was called before Mule was used, the data name inside the property data of mule will change in runtime.
