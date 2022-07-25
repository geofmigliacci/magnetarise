# 01-cats-app

This is a simple cats resource made to show how net events of Magnetarise works as well as the ```onApplicationBootstrap``` hook works. It has 2 commands: 

* ```cats``` get all cats in memory
* ```findcats``` search all cats with a given name

The cat list can be found inside the ```src/sv/services/cats.service.ts```.

## Getting started 

To run this resource move this folder ```01-cats-app``` to your server resources folder and build the files:

```
npm run build
```

or

```
yarn run build
```

After that you can now add your ```server.cfg```:

```
ensure 01-cats-app
```

You can now connect to your server & use the ```cats``` command, this command will return all the cats from the server inside the console. You can also you the ```findcats Super``` or ```findcats Name``` to search for a specific cat with this name.

Don't forget to open your console with <kbd>F8</kbd> to see the result.