# Description

An experimental SDK module for loading and playing sounds

# Usage

- Paste this module into your project
- Configure your `config.js` to include `import { AnimatedEventModule } from './animations/AnimatedEventModule.js';` and add `AnimatedEventModule` to the declaration of the `modules` array.
- In your Referee, include `@Inject AnimatedEventModule animatedEventModule;`.
- Include sounds in the `assets/sounds/` folder.
- Delete any already existing `demo.js` file from `src/main/resources/view/`

# Example

In your Referee's `gameTurn`:
```java
// Play sound at t = 0
ViewerEvent soundEvent = animatedEventModule.createAnimationEvent("Sound", 0.0);
soundEvent.params.put("path", "sounds/death.wav");
```

# TODO

- Preload sounds instead of downloading them when first played.
