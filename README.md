# Higad
A snake-like game crawling against the terminal, written in Node.

[![Build Status](https://travis-ci.com/devshark/higad.svg?branch=master)](https://travis-ci.com/devshark/higad)

## Installation
You need npm or yarn or other Node package managers before you can install.
```sh
$ yarn install
$ # or just
$ yarn
```

## Starting the game
Two ways to run, either using your package manager or directly via Node
```sh
$ yarn start
$ # or via Node
$ node src/index.js
```

## Playing the game
Just use arrow keys to move the player towards its food, the heart. It will grow as much as you can eat, or until you run out of spaces to move. Game is over when you hit the walls, or yourself.

## Exiting the game
Just press either the *Esc* key, the letter *q*, or *Ctrl+C* (*Cmd+C* on Mac) keyboard combination.
